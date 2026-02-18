import { Progress } from "../components/Progress/Progress";
import { AddEditTag } from "../components/Forms/TagForm";
import { AddEditTask } from "../components/Forms/TaskForm";
import { useTasksTags } from "../components/TaskManager";

// export function editLoader({ params }) {
//   const context = useTasksTags();
//   switch (params.type) {
//     case "task":
//       return context.tasksTags.tasks;
//     case "tag":
//       return context.tasksTags.tasks;
//   }
// }

export default function UpdatePage() {
  return (
    <>
      <Progress />
      <AddEditTag />
      {/* <AddEditTask /> */}
    </>
  );
}
