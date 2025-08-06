import { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const AdminTable = ({ 
  data, 
  columns, 
  loading, 
  error, 
  onRetry, 
  onEdit, 
  onDelete, 
  emptyMessage = "No data found",
  emptyIcon = "Inbox"
}) => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    if (!sortField || !data) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? result : -result;
      }
      
      if (typeof aValue === 'number') {
        const result = aValue - bValue;
        return sortDirection === "asc" ? result : -result;
      }
      
      if (aValue instanceof Date || typeof aValue === 'string') {
        const result = new Date(aValue) - new Date(bValue);
        return sortDirection === "asc" ? result : -result;
      }
      
      return 0;
    });
  };

  const renderCellValue = (item, column) => {
    const value = item[column.field];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    if (column.type === 'date') {
      return format(new Date(value), 'MMM dd, yyyy HH:mm');
    }
    
    if (column.type === 'badge') {
      return <Badge variant={column.badgeVariant || 'default'}>{value}</Badge>;
    }
    
    if (column.type === 'boolean') {
      return (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }
    
    if (column.type === 'currency') {
      return `$${value.toLocaleString()}`;
    }
    
    if (column.type === 'array') {
      return value?.length || 0;
    }
    
    return value;
  };

  if (loading) {
    return <Loading type="table" className="w-full" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!data || data.length === 0) {
    return (
      <Empty 
        title={emptyMessage}
        description="Start by adding your first entry"
        icon={emptyIcon}
      />
    );
  }

  const sortedData = getSortedData();

  return (
    <div className="bg-navy-card rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-navy-light border-b border-gray-600">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.field}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-300 ${
                    column.sortable ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <ApperIcon 
                        name={sortField === column.field && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'}
                        size={14}
                        className={sortField === column.field ? 'text-electric' : 'text-gray-500'}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-700">
            {sortedData.map((item) => (
              <tr key={item.Id} className="hover:bg-navy-light/50 transition-colors">
                {columns.map((column) => (
                  <td key={column.field} className="px-4 py-4 text-sm text-gray-300">
                    {renderCellValue(item, column)}
                  </td>
                ))}
                
                <td className="px-4 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="text-electric hover:text-white"
                      >
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;