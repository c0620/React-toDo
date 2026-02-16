import { Progress } from "../components/Progress/Progress";
import { AddEditTag } from "../components/Forms/TagForm";
import { AddEditTask } from "../components/Forms/TaskForm";

export default function UpdatePage() {
  return (
    <>
      <Progress />
      <AddEditTag />
      <AddEditTask />
    </>
  );
}
