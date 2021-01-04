export type TimingFunction = (t: number) => number 

export const EasingFunctions: Record<string, TimingFunction> = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + (--t) * t * t * t * t,
  easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
}

export const animate = (
  duration: number,
  callback: (t: number) => void,
  fps = 60,
): Promise<void> => new Promise(resolve => {
  let frame = 0

  const interval = setInterval(() => {
    const x = frame / (duration / fps)
    
    callback(x > 1 ? 1 : x)

    if (frame >= duration / fps) {
      clearInterval(interval)
      resolve()
    }

    frame++
  }, 1000 / fps)
})
