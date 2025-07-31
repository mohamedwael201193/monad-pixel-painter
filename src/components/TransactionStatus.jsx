import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

export const TransactionStatus = ({ status }) => {
  if (!status) return null;

  const getIcon = () => {
    switch (status.type) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (status.type) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertDescription>{status.message}</AlertDescription>
    </Alert>
  );
};

