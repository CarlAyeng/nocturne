import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { Slider } from '../common/Slider'
import { usePlayer } from '../../context/PlayerContext'
import { IconButton } from '../common/IconButton'

export function VolumeControl() {
  const { volume, muted, setVolume, toggleMute } = usePlayer()
  const effective = muted ? 0 : volume

  const Icon = effective === 0 ? VolumeX : effective < 0.34 ? Volume : effective < 0.67 ? Volume1 : Volume2

  return (
    <div className="flex items-center gap-1.5">
      <IconButton label={muted ? 'Unmute' : 'Mute'} size="sm" onClick={toggleMute}>
        <Icon className="h-5 w-5" />
      </IconButton>
      <Slider
        value={effective}
        max={1}
        ariaLabel="Volume"
        className="w-24"
        onChange={(v) => setVolume(v)}
      />
    </div>
  )
}
