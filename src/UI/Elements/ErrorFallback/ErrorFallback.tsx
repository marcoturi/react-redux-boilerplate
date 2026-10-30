import { Alert, AlertDescription, AlertTitle } from '@/UI/Base/alert';
import { Button } from '@/UI/Base/button';
import { Container } from '@/UI/Elements/Container';

export function ErrorFallback() {
  return (
    <Container className="flex flex-col items-start gap-4">
      <Alert variant="destructive">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>Reload the page to try again.</AlertDescription>
      </Alert>
      {/* A full reload, not resetErrorBoundary: a lazy page whose chunk failed
          stays rejected until the module is fetched again */}
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </Container>
  );
}
