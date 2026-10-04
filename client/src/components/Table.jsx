import React from 'react';
import { FiChevronUp, FiChevronDown, FiInbox } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = 'No records found',
  pagination,
  onPageChange,
}) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: 'var(--glass-border)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0, 0, 0, 0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                const canSort = col.sortable !== false;

                return (
                  <th
                    key={col.key}
                    onClick={() => canSort && onSort && onSort(col.key)}
                    style={{
                      padding: '16px 20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isSorted ? 'var(--primary)' : 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: canSort ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span>{col.label}</span>
                      {canSort && (
                        <span style={{ display: 'inline-flex', flexDirection: 'column', color: isSorted ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {isSorted && sortOrder === 'asc' ? (
                            <FiChevronUp size={14} />
                          ) : isSorted && sortOrder === 'desc' ? (
                            <FiChevronDown size={14} />
                          ) : (
                            <div style={{ opacity: 0.3 }}>
                              <FiChevronUp size={11} style={{ marginBottom: '-3px' }} />
                              <FiChevronDown size={11} />
                            </div>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} style={{ padding: '18px 20px' }}>
                      <div
                        style={{
                          height: '16px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '4px',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          width: `${50 + (cIdx * 20) % 40}%`,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <FiInbox size={26} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Actual Table Rows
              data.map((row, idx) => (
                <motion.tr
                  key={row.id || idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] || '—'}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination bar */}
        {pagination && pagination.totalPages > 1 && (
          <div
            style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.4)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            <span>
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: pagination.page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: pagination.page >= pagination.totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Table;
