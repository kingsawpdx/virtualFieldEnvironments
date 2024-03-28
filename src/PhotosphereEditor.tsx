import PhotosphereViewer from "./PhotosphereViewer.tsx";
import { VFE } from "./DataStructures.ts";

interface PhotosphereEditorProps {
  vfe: VFE;
}

const PhotosphereEditor: React.FC<PhotosphereEditorProps> = ({ vfe }) => {
  return (
    <div>
      <PhotosphereViewer vfe={vfe} />
    </div>
  );
};

export default PhotosphereEditor;