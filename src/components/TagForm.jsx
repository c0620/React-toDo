import { colors } from "../data";

export function AddEditTag({
  tagId = null,
  color = null,
  name = null,
  date = new Date(),
  tag = null,
  title = null,
  done = false,
}) {
  let colorPickers = colors.map((color) => (
    <>
      <style>
        {`
      .C${color.main.replace("#", "")}[type='radio']::after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: ${color.main};
        content: '';
        display: inline-block;
        visibility: visible;
        border: 2px solid white;
      }

      .C${color.main.replace("#", "")}[type='radio']:checked::after {
        background-color: ${color.dark};
      }
    `}
      </style>
      <input
        className={`C${color.main.replace("#", "")}`}
        type="radio"
        style={{ accentColor: color.main }}
        value={[color.main, color.dark]}
      />
    </>
  ));

  return (
    <div>
      <form onSubmit={console.log("s_")}>
        <label>Название цели</label>
        {colorPickers}
        <button type="submin">Добавить цель</button>
      </form>
    </div>
  );
}
