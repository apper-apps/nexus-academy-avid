import Input from '@/components/atoms/Input';

const FormField = ({
  label,
  id,
  error,
  required,
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-2">
          {label}
          {required && <span className="text-electric ml-1">*</span>}
        </label>
      )}
      <Input
        id={id}
        error={error}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;