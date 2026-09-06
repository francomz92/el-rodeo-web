import { Label } from "@components/ui/label";
import { Switch, type SwitchPrimitive } from "@components/ui/switch";


type SwitchWithLabelProps = SwitchPrimitive.Root.Props & {
    labelText: string;
}
const SwitchWithLabel = (props: SwitchWithLabelProps) => {
    const { labelText, ...switchProps } = props;

  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" {...switchProps} />
      <Label htmlFor="airplane-mode" className="cursor-pointer">
          {labelText}
      </Label>
    </div>
  );
};

export default SwitchWithLabel;
