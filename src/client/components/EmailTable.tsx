import { Email } from '../hooks/useTempMail';

interface Props {
  emails: Email[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmailTable({ emails, onSelect, onDelete }: Props) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left border-b">
          <th className="p-2">From</th>
          <th className="p-2">Subject</th>
          <th className="p-2">Date</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {emails.map((e) => (
          <tr key={e.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-2 cursor-pointer" onClick={() => onSelect(e.id)}>{e.from}</td>
            <td className="p-2 cursor-pointer" onClick={() => onSelect(e.id)}>{e.subject}</td>
            <td className="p-2 cursor-pointer" onClick={() => onSelect(e.id)}>{new Date(e.date).toLocaleString()}</td>
            <td className="p-2">
              <button onClick={() => onDelete(e.id)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
