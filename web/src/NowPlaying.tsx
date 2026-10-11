import type { Ctx } from "./App";
import { formatDuration } from "./format";

export function NowPlaying({ s, run }: Ctx) {
  const p = s.playback;
  const go = (c: Parameters<Ctx["run"]>[0]) => void run(c).catch(() => {});
  const t = p.track;
  const canControl = p.canControl ?? p.engine === "mpv";
  return (
    <footer className="now">
      <div className="meta">
        {t ? (
          <>
            <b>{t.title}</b>
            <span>{t.artist ?? ""}</span>
          </>
        ) : (
          <span>Nothing playing</span>
        )}
      </div>
      <div className="transport">
        <div className="buttons">
          <button title="Shuffle" className={p.shuffle ? "on" : ""} onClick={() => go({ cmd: "toggleShuffle" })}>⤨</button>
          <button title="Previous" disabled={!t} onClick={() => go({ cmd: "prev" })}>⏮</button>
          <button title="Play / pause (space)" disabled={!t} onClick={() => go({ cmd: "togglePause" })}>
            {p.paused || !t ? "▶" : "⏸"}
          </button>
          <button title="Next" disabled={!t} onClick={() => go({ cmd: "next" })}>⏭</button>
          <button
            title={`Repeat: ${p.repeat}`}
            className={p.repeat !== "off" ? "on" : ""}
            onClick={() => go({ cmd: "cycleRepeat" })}
          >
            {p.repeat === "one" ? "🔂" : "🔁"}
          </button>
        </div>
        <div className="seek">
          <span>{formatDuration(p.position)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(p.duration, 1)}
            value={Math.min(p.position, Math.max(p.duration, 1))}
            disabled={!t || !canControl}
            onChange={(e) =>
              go({ cmd: "seek", seconds: Number(e.target.value) - p.position })
            }
          />
          <span>{formatDuration(p.duration)}</span>
        </div>
      </div>
      <div className="volume">
        🔊
        <input
          type="range"
          min={0}
          max={100}
          value={p.volume}
          disabled={!canControl}
          onChange={(e) => go({ cmd: "setVolume", volume: Number(e.target.value) })}
        />
      </div>
    </footer>
  );
}
