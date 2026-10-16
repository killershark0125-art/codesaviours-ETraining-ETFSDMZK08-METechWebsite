import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const MAP_URL = '/map-data/pakistan-provinces.geojson'

const PROJECT_GREEN = 0x00ff8c
const MUTED_GREEN = 0x0b3d2b
const GOLD = 0xffd12f

const MAP_BOUNDS = {
  minLon: 60.5,
  maxLon: 78,
  minLat: 23,
  maxLat: 37.8,
}

const MAP_CENTER = { longitude: 69.25, latitude: 30.4 }
const MAP_SCALE = 1.3
const CAMERA_FOV = 46

function projectCoordinates(longitude, latitude) {
  return new THREE.Vector3(
    (longitude - MAP_CENTER.longitude) * MAP_SCALE,
    (latitude - MAP_CENTER.latitude) * MAP_SCALE,
    0,
  )
}

function readProvinceName(feature) {
  const properties = feature.properties || {}

  return (
    properties.shapeName ||
    properties.NAME_1 ||
    properties.name ||
    properties.shapeGroup ||
    'Province'
  )
}

function getPolygons(geometry) {
  if (geometry?.type === 'Polygon') return [geometry.coordinates]
  if (geometry?.type === 'MultiPolygon') return geometry.coordinates
  return []
}

function cleanRing(ring = []) {
  if (ring.length < 2) return ring

  const first = ring[0]
  const last = ring[ring.length - 1]

  return first[0] === last[0] && first[1] === last[1]
    ? ring.slice(0, -1)
    : ring
}

function createShape(rings) {
  const outer = cleanRing(rings[0] || [])
  if (outer.length < 3) return null

  const shape = new THREE.Shape()

  outer.forEach(([longitude, latitude], index) => {
    const point = projectCoordinates(longitude, latitude)
    if (index === 0) shape.moveTo(point.x, point.y)
    else shape.lineTo(point.x, point.y)
  })

  shape.closePath()

  for (const rawHole of rings.slice(1)) {
    const hole = cleanRing(rawHole)
    if (hole.length < 3) continue

    const path = new THREE.Path()
    hole.forEach(([longitude, latitude], index) => {
      const point = projectCoordinates(longitude, latitude)
      if (index === 0) path.moveTo(point.x, point.y)
      else path.lineTo(point.x, point.y)
    })
    path.closePath()
    shape.holes.push(path)
  }

  return shape
}

function getRingCenter(ring) {
  const points = cleanRing(ring)
  if (!points.length) return new THREE.Vector3()

  const totals = points.reduce(
    (sum, [longitude, latitude]) => ({
      longitude: sum.longitude + longitude,
      latitude: sum.latitude + latitude,
    }),
    { longitude: 0, latitude: 0 },
  )

  return projectCoordinates(
    totals.longitude / points.length,
    totals.latitude / points.length,
  )
}

function createCityLabel(location) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128

  const context = canvas.getContext('2d')
  if (!context) return new THREE.Sprite()

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.font = '600 34px Arial'
  context.textBaseline = 'middle'

  const label = String(location.city || 'Project location').toUpperCase()
  const textWidth = Math.min(context.measureText(label).width, canvas.width - 54)

  context.fillStyle = 'rgba(1, 13, 8, 0.82)'
  context.fillRect(10, 22, textWidth + 38, 82)
  context.strokeStyle = '#00ff8c'
  context.lineWidth = 3
  context.strokeRect(10, 22, textWidth + 38, 82)
  context.fillStyle = '#ffffff'
  context.fillText(label, 28, 64, canvas.width - 45)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    }),
  )

  sprite.scale.set(1.65, 0.42, 1)
  sprite.renderOrder = 10
  return sprite
}

function getInitialCameraDistance(aspect) {
  const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV / 2)
  const visibleMapWidth = (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon) * MAP_SCALE
  const visibleMapHeight = (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) * MAP_SCALE
  const verticalDistance = visibleMapHeight / (2 * Math.tan(halfFov))
  const horizontalDistance = visibleMapWidth / (2 * Math.tan(halfFov) * Math.max(aspect, 0.1))

  return Math.max(verticalDistance, horizontalDistance) * 1.22
}

export default function HolographicPakistanMap({
  locations = [],
  activeKey = '',
  onLocationSelect,
}) {
  const hostRef = useRef(null)
  const selectRef = useRef(onLocationSelect)
  const activeKeyRef = useRef(activeKey)
  const focusRef = useRef(null)
  const resetRef = useRef(null)
  const previousKeyRef = useRef(activeKey)

  const [hoverLabel, setHoverLabel] = useState('')
  const [mapError, setMapError] = useState('')

  useEffect(() => {
    selectRef.current = onLocationSelect
    activeKeyRef.current = activeKey
  }, [onLocationSelect, activeKey])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let disposed = false
    let animationFrame = 0
    let hoveredObject = null
    let cameraGoal = null
    let pointerDown = null
    let draggedDuringPointer = false
    let hasInteracted = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020a07)

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 200)
    camera.position.set(0, -6, 34)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.className = 'holo-map-canvas'
    renderer.domElement.setAttribute(
      'aria-label',
      'Interactive holographic map of Pakistan and project locations',
    )
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'
    host.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enabled = true
    controls.enableRotate = false
    controls.enableZoom = true
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.minDistance = 7
    controls.maxDistance = 90
    controls.maxPolarAngle = Math.PI * 0.49
    controls.update()

    scene.add(new THREE.AmbientLight(0xffffff, 1.25))
    const light = new THREE.DirectionalLight(0x70ffb3, 2.5)
    light.position.set(-4, 5, 10)
    scene.add(light)

    const grid = new THREE.GridHelper(36, 120, 0x126b43, 0x0b3526)
    grid.rotation.x = Math.PI / 2
    grid.position.z = -0.25
    grid.material.transparent = true
    grid.material.opacity = 0.55
    scene.add(grid)

    const countryGroup = new THREE.Group()
    scene.add(countryGroup)

    const interactiveObjects = []
    const provinceMeshes = []
    const locationMeshes = []
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    function fitCameraToViewport() {
      if (!host.clientWidth || !host.clientHeight) return

      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()

      if (!hasInteracted && !cameraGoal && !activeKeyRef.current) {
        const distance = getInitialCameraDistance(camera.aspect)
        camera.position.set(0, -distance * 0.12, distance)
        controls.target.set(0, 0, 0)
        camera.lookAt(controls.target)
        controls.update()
      }

      renderer.setSize(host.clientWidth, host.clientHeight, false)
    }

    function focusOn(worldPoint, close = false) {
      hasInteracted = true
      const target = new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z + 0.08)
      const offset = close
        ? new THREE.Vector3(0, -2.4, 5.3)
        : new THREE.Vector3(0, -3.3, 7.2)

      cameraGoal = {
        target,
        position: target.clone().add(offset),
      }
      controls.enabled = false
    }

    function resetView() {
      hasInteracted = false
      countryGroup.rotation.set(0, 0, 0)
      countryGroup.position.set(0, 0, 0)
      previousKeyRef.current = ''
      selectRef.current?.('')

      const distance = getInitialCameraDistance(
        host.clientWidth / Math.max(host.clientHeight, 1),
      )
      cameraGoal = {
        target: new THREE.Vector3(0, 0, 0),
        position: new THREE.Vector3(0, -distance * 0.12, distance),
      }
      controls.enabled = false
    }

    focusRef.current = (point, close = false) => {
      const worldPoint = countryGroup.localToWorld(point.clone())
      focusOn(worldPoint, close)
    }
    resetRef.current = resetView

    function pointFromEvent(event) {
      const rect = renderer.domElement.getBoundingClientRect()
      if (!rect.width || !rect.height) return null

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const hit = raycaster.intersectObjects(interactiveObjects, false)[0]
      return hit?.object || null
    }

    function handlePointerDown(event) {
      if (event.button !== undefined && event.button !== 0) return

      pointerDown = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
      }
      draggedDuringPointer = false
      renderer.domElement.style.cursor = 'grabbing'

      try {
        renderer.domElement.setPointerCapture(event.pointerId)
      } catch {
        // Pointer capture may not be available in every browser context.
      }
    }

    function handlePointerMove(event) {
      if (pointerDown && pointerDown.pointerId === event.pointerId) {
        const distance = Math.hypot(
          event.clientX - pointerDown.startX,
          event.clientY - pointerDown.startY,
        )

        if (distance > 5) {
          draggedDuringPointer = true
          hasInteracted = true
          cameraGoal = null
          controls.enabled = true

          const deltaX = event.clientX - pointerDown.lastX
          const deltaY = event.clientY - pointerDown.lastY

          countryGroup.rotation.y += deltaX * 0.006
          countryGroup.rotation.x += deltaY * 0.006
          countryGroup.rotation.x = THREE.MathUtils.clamp(
            countryGroup.rotation.x,
            -0.8,
            0.8,
          )
        }

        pointerDown.lastX = event.clientX
        pointerDown.lastY = event.clientY

        if (draggedDuringPointer) {
          setHoverLabel('')
          renderer.domElement.style.cursor = 'grabbing'
          return
        }
      }

      const object = pointFromEvent(event)
      if (object !== hoveredObject) {
        hoveredObject = object
        const label = object
          ? object.userData.kind === 'location'
            ? `${object.userData.city} · ${object.userData.count} project(s)`
            : object.userData.provinceName
          : ''
        setHoverLabel(label)
      }

      renderer.domElement.style.cursor = object ? 'pointer' : 'grab'
    }

    function handlePointerUp(event) {
      if (pointerDown && pointerDown.pointerId !== event.pointerId) return
      pointerDown = null
      renderer.domElement.style.cursor = 'grab'
    }

    function handlePointerCancel() {
      pointerDown = null
      draggedDuringPointer = false
      renderer.domElement.style.cursor = 'grab'
    }

    function handlePointerLeave() {
      if (!pointerDown) {
        hoveredObject = null
        setHoverLabel('')
        renderer.domElement.style.cursor = 'grab'
      }
    }

    function clearSelectionAndReset() {
      draggedDuringPointer = false
      resetView()
    }

    function handleClick(event) {
      if (draggedDuringPointer) {
        draggedDuringPointer = false
        return
      }

      const object = pointFromEvent(event)
      if (!object) {
        clearSelectionAndReset()
        return
      }

      hasInteracted = true

      if (object.userData.kind === 'location') {
        const location = object.userData.location

        if (previousKeyRef.current === location.key) {
          clearSelectionAndReset()
          return
        }

        previousKeyRef.current = location.key
        selectRef.current?.(location.key)
        const point = projectCoordinates(location.longitude, location.latitude)
        focusRef.current?.(point, true)
        return
      }

      if (object.userData.kind === 'province') {
        const provinceName = object.userData.provinceName
        const normalize = (value) =>
          String(value || '').toLowerCase().replace(/[^a-z]/g, '')

        const match = locations.find(
          (location) => normalize(location.province) === normalize(provinceName),
        )

        if (match && previousKeyRef.current === match.key) {
          clearSelectionAndReset()
          return
        }

        if (match) {
          previousKeyRef.current = match.key
          selectRef.current?.(match.key)
        }

        const worldCenter = countryGroup.localToWorld(
          object.userData.mapCenter.clone(),
        )
        focusOn(worldCenter, false)
      }
    }

    async function loadBoundaries() {
      try {
        const response = await fetch(MAP_URL)
        if (!response.ok) {
          throw new Error('Could not load Pakistan province boundaries.')
        }

        const geojson = await response.json()
        if (!Array.isArray(geojson.features)) {
          throw new Error('The province boundary file is not valid GeoJSON.')
        }
        if (disposed) return

        for (const feature of geojson.features) {
          const provinceName = readProvinceName(feature)
          const polygons = getPolygons(feature.geometry)

          for (const rings of polygons) {
            const shape = createShape(rings)
            if (!shape) continue

            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 0.12,
              bevelEnabled: false,
              curveSegments: 2,
            })

            const material = new THREE.MeshStandardMaterial({
              color: MUTED_GREEN,
              emissive: 0x003c25,
              emissiveIntensity: 0.5,
              metalness: 0.38,
              roughness: 0.4,
              transparent: true,
              opacity: 0.96,
              side: THREE.DoubleSide,
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.userData = {
              kind: 'province',
              provinceName,
              mapCenter: getRingCenter(rings[0]),
            }

            countryGroup.add(mesh)
            provinceMeshes.push(mesh)
            interactiveObjects.push(mesh)

            for (const ring of rings) {
              const points = cleanRing(ring).map(([longitude, latitude]) => {
                const point = projectCoordinates(longitude, latitude)
                point.z = 0.15
                return point
              })

              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
              const glowLine = new THREE.LineLoop(
                lineGeometry,
                new THREE.LineBasicMaterial({
                  color: PROJECT_GREEN,
                  transparent: true,
                  opacity: 0.12,
                }),
              )
              const edgeLine = new THREE.LineLoop(
                lineGeometry.clone(),
                new THREE.LineBasicMaterial({
                  color: 0x43ffad,
                  transparent: true,
                  opacity: 0.86,
                }),
              )

              countryGroup.add(glowLine, edgeLine)
            }
          }
        }

        for (const location of locations) {
          const longitude = Number(location.longitude)
          const latitude = Number(location.latitude)

          if (
            !Number.isFinite(longitude) ||
            !Number.isFinite(latitude) ||
            longitude < MAP_BOUNDS.minLon ||
            longitude > MAP_BOUNDS.maxLon ||
            latitude < MAP_BOUNDS.minLat ||
            latitude > MAP_BOUNDS.maxLat
          ) {
            continue
          }

          const point = projectCoordinates(longitude, latitude)
          const group = new THREE.Group()
          group.position.set(point.x, point.y, 0.33)
          countryGroup.add(group)

          const halo = new THREE.Mesh(
            new THREE.TorusGeometry(0.17, 0.025, 6, 28),
            new THREE.MeshBasicMaterial({
              color: GOLD,
              transparent: true,
              opacity: 0.85,
            }),
          )

          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 14, 10),
            new THREE.MeshStandardMaterial({
              color: GOLD,
              emissive: GOLD,
              emissiveIntensity: 1.5,
              metalness: 0.2,
              roughness: 0.25,
            }),
          )

          group.add(halo, dot)
          const label = createCityLabel(location)
          label.position.set(0.62, 0.28, 0.15)
          group.add(label)

          dot.userData = {
            kind: 'location',
            city: location.city,
            count: location.projects.length,
            location,
          }

          interactiveObjects.push(dot)
          locationMeshes.push({ dot, halo, location })
        }

        setMapError('')
      } catch (error) {
        if (!disposed) {
          setMapError(error.message || 'Could not load the map.')
        }
      }
    }


    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('pointerup', handlePointerUp)
    renderer.domElement.addEventListener('pointercancel', handlePointerCancel)
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave)
    renderer.domElement.addEventListener('click', handleClick)

const observer = new ResizeObserver(fitCameraToViewport)
observer.observe(host)
fitCameraToViewport()
loadBoundaries()

    const clock = new THREE.Clock()

    function animate() {
      animationFrame = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      if (!cameraGoal && !pointerDown) {
        countryGroup.position.y = Math.sin(elapsed * 0.3) * 0.035
        countryGroup.rotation.z = Math.sin(elapsed * 0.16) * 0.004
      }

      locationMeshes.forEach(({ dot, halo, location }, index) => {
        const selected = location.key === activeKeyRef.current
        const hovered = hoveredObject === dot
        dot.scale.setScalar(selected ? 1.45 : hovered ? 1.3 : 1)
        halo.scale.setScalar(1 + Math.sin(elapsed * 2.6 + index) * 0.13)
        halo.material.opacity =
          0.4 + (Math.sin(elapsed * 2.6 + index) + 1) * 0.22
        dot.material.emissiveIntensity = selected || hovered ? 2.4 : 1.2
      })

      provinceMeshes.forEach((mesh) => {
        const hovered = hoveredObject === mesh
        mesh.material.color.setHex(hovered ? 0x0b985b : MUTED_GREEN)
        mesh.material.emissive.setHex(hovered ? 0x00aa60 : 0x003c25)
        mesh.material.emissiveIntensity = hovered ? 1.5 : 0.5
      })

      if (cameraGoal) {
        camera.position.lerp(cameraGoal.position, 0.07)
        controls.target.lerp(cameraGoal.target, 0.07)

        if (
          camera.position.distanceTo(cameraGoal.position) < 0.04 &&
          controls.target.distanceTo(cameraGoal.target) < 0.04
        ) {
          camera.position.copy(cameraGoal.position)
          controls.target.copy(cameraGoal.target)
          cameraGoal = null
          controls.enabled = true
        }
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      resetRef.current = null
      focusRef.current = null
      disposed = true
      cancelAnimationFrame(animationFrame)
      observer.disconnect()

      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('pointerup', handlePointerUp)
      renderer.domElement.removeEventListener('pointercancel', handlePointerCancel)
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave)
      renderer.domElement.removeEventListener('click', handleClick)

      controls.dispose()

      scene.traverse((object) => {
        object.geometry?.dispose()

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.map?.dispose()
            material.dispose()
          })
        } else if (object.material) {
          object.material?.map?.dispose()
          object.material?.dispose()
        }
      })

      renderer.dispose()
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [locations])

  useEffect(() => {
    if (!activeKey || activeKey === previousKeyRef.current) return

    const location = locations.find((item) => item.key === activeKey)
    if (location) {
      focusRef.current?.(
        projectCoordinates(location.longitude, location.latitude),
        true,
      )
    }

    previousKeyRef.current = activeKey
  }, [activeKey, locations])

  return (
    <div className="holo-map-shell">
      <div className="holo-map-toolbar">
        <span>PAKISTAN / PROJECT GEOMETRY</span>
        <button type="button" onClick={() => resetRef.current?.()}>
          RESET VIEW ↺
        </button>
      </div>

      <div className="holo-map-viewport">
        <div className="holo-map-canvas-host" ref={hostRef} />

        <div className="holo-map-hover" aria-live="polite">
          <span className="holo-status-dot" />
          {hoverLabel ||
            'DRAG TO ROTATE · SCROLL TO ZOOM · CLICK A MARKER TO EXPLORE · CLICK EMPTY SPACE TO RESET'}
        </div>

        {mapError && (
          <div className="holo-map-error" role="alert">
            {mapError}
          </div>
        )}

        <div className="holo-map-axis">ADM1 / WGS84 / 3D</div>
      </div>

      <div className="holo-map-bottomline">
        <span><i /> PROVINCE BOUNDARIES</span>
        <span><i /> PROJECT LOCATIONS</span>
        <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
      </div>

      <p className="holo-map-attribution">
        Administrative boundaries: geoBoundaries, Pakistan ADM1.
      </p>
    </div>
  )
}
