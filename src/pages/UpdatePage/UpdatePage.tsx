import { Progress } from "../../components/Progress/Progress";
import { AddEditTag } from "../../components/Forms/TagForm";
import { AddEditTask } from "../../components/Forms/TaskForm";
import { useTasksTagsStore } from "../../components/TaskManager";
import { useActionData, useLoaderData } from "react-router";
import styles from "./UpdatePage.module.scss";

interface updatePars {
  type: string;
  id: string;
}

export async function updateLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  if (Object.keys(params).length != 0) {
    if (params.type == "task") {
      if (Number.isNaN(params.id)) {
        throw Error("UpdatePage: wrong task id");
      }
    } else {
      throw Error(`UpdatePage: unsupported type ${params.type}`);
    }
    return { type: params.type, id: params.id };
  }

  return null;
}

export default function UpdatePage() {
  const userParams = useLoaderData();
  const context = useTasksTagsStore();
  let task = null;

  if (userParams?.type === "task") {
    task = context.tasks.find((task) => task.id === +userParams.id);
  }

  return (
    <div className={styles.layout}>
      <Progress />
      <div className={styles.forms}>
        <AddEditTask task={task ?? null} />
        <AddEditTag />
      </div>
    </div>
  );
}
