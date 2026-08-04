interface Props {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Select({
  value,
  options,
  onChange,
}: Props) {

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        px-3
        py-2
        text-sm
        text-white
        outline-none
        focus:border-blue-500
      "
    >
      {options.map(option => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
}