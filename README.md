# Let me shatter your reality

```
Let me shatter your window into the world
And show me what you see through it
```

Web based tool. Applying various "glitch" filters to camera feed.

### TODO
- fix camera isAvailable function: cameras info has one element if user denied access; also should be avaliable only when feed is ready
- second off screen canvas to record in full camera resolution  (p5 graphics?)
- NotReadableError - possible fix: make sure that everything happens in order (proper use of await/async): 1. ask permissions/stop test stream 2. load camera info 3. start feed; also next camera only if previous stream is stopped
- rewrite filter to a class
- change filter resolution when camera changes
- expose filter params
- set framerate
- change script types to module
- present nicely for desktop
- fix ui
- preload ffmpeg when worker ready
