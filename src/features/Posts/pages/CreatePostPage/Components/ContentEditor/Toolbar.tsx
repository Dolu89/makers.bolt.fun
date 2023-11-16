import TextEditorComponents from "src/Components/Inputs/TextEditor";

interface Props {
  disabled?: boolean;
}

export default function Toolbar(props: Props) {
  if (props.disabled) return <div className={`h-36 bg-gray-100`}></div>;

  return (
    <div className={`flex flex-wrap gap-16 md:gap-36 bg-gray-100`}>
      <div className={"flex"}>
        <TextEditorComponents.ToolButton cmd="heading" />
        <TextEditorComponents.ToolButton cmd="bold" />
        <TextEditorComponents.ToolButton cmd="italic" />
        <TextEditorComponents.ToolButton cmd="underline" />
      </div>
      <div className={"flex"}>
        {/* <TextEditorComponents.ToolButton cmd='leftAlign' />
                <TextEditorComponents.ToolButton cmd='centerAlign' />
            <TextEditorComponents.ToolButton cmd='rightAlign' /> */}
        <TextEditorComponents.ToolButton cmd="link" />
        <TextEditorComponents.ToolButton cmd="code" />
        <TextEditorComponents.ToolButton cmd="codeBlock" />
        <TextEditorComponents.ToolButton cmd="blockquote" />
        <TextEditorComponents.ToolButton cmd="bulletList" />
        <TextEditorComponents.ToolButton cmd="orderedList" />
        <TextEditorComponents.ToolButton cmd="img" />
        <TextEditorComponents.ToolButton cmd="youtube" />
      </div>

      <div className="flex ml-auto">
        <TextEditorComponents.ToolButton cmd="undo" />
        <TextEditorComponents.ToolButton cmd="redo" />
      </div>
    </div>
  );
}
