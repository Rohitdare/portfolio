'use client';

interface TelemetryHUDProps {
  telemetryNumber: string;
  progressPercent: number;
}

export default function TelemetryHUD({ telemetryNumber, progressPercent }: TelemetryHUDProps) {
  return (
    <aside className="telemetry-hud" aria-hidden="true">
      <span id="telemetry-index" className="telemetry-index">
        {telemetryNumber} / 06
      </span>
      <div className="telemetry-rail">
        <div
          id="telemetry-bar"
          className="telemetry-bar"
          style={{ height: `${progressPercent}%` }}
        />
      </div>
    </aside>
  );
}
