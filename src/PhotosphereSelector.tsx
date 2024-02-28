export interface PhotosphereSelectorProps {
  options: string[];
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}

function PhotosphereSelector(props: PhotosphereSelectorProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: 0,
        right: 0,
        width: "200px",
        padding: "4px",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "white",
        borderRadius: "4px",
        boxShadow: "0 0 4px grey",
        zIndex: 100,
      }}
    >
      <label htmlFor="scene-select">Scene: </label>
      <select
        id="scene-select"
        value={props.value}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
        style={{ paddingInline: "8px", paddingBlock: "4px", width: "150px" }}
      >
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PhotosphereSelector;
