export function SearchDropdown({
  searchInput,
  inputName,
  value,
  onChange,
  items,
  filterFunc,
}) {
  const filteredItems = searchInput
    ? items.filter((item) =>
        filterFunc(item).toLowerCase().includes(searchInput.toLowerCase())
      )
    : items;

  return (
    <>
      <select
        name={inputName}
        required
        value={value}
        onChange={(e) => onChange("tag", { id: Number(e.target.value) })}
      >
        {filteredItems.map((item) => {
          return (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          );
        })}
      </select>
      ;
    </>
  );
}
