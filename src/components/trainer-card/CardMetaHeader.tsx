export default function CardMetaHeader() {
  return (
    <>
      {/* Punch Slot Cutout At Top */}
      <div className="card-punch-slot-container">
        <div className="card-punch-slot">
          <div className="punch-slot-tongue-tip" />
        </div>
      </div>

      {/* CARD META HEADER */}
      <header className="card-meta-header">
        <div className="meta-id-group">
          <span className="id-pulse-pip" />
          <span className="meta-id-text">TRAINER ID // NO. 0842</span>
          <span className="meta-sep">|</span>
          <span className="meta-ver">CL-VER: 4.2.9</span>
        </div>
        <div className="meta-status-pill">
          <span className="status-dot" />
          <span className="status-text">AVAILABLE FOR HIRE</span>
        </div>
      </header>
    </>
  );
}
