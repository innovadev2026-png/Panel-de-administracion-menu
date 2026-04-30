// /components/ui/Table/index.tsx
import styles from "./Table.module.css";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
};

export default function Table<T extends { id: string }>({
  columns,
  data,
}: Props<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                Sin datos
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className={styles.tr}>
                {columns.map((col) => (
                  <td key={String(col.key)} className={styles.td}>
                    {col.render
                      ? col.render(row)
                      : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}