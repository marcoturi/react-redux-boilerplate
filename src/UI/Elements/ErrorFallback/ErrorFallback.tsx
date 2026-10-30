import { Alert, AlertDescription, AlertTitle } from '@/UI/Base/alert';
import { Button } from '@/UI/Base/button';
import { Container } from '@/UI/Elements/Container';

export function ErrorFallback() {
  return (
    <Container className="flex flex-col items-start gap-4">
      <Alert variant="destructive">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>Reload the app to try again.</AlertDescription>
      </Alert>
      <Button onClick={() => window.location.assign(window.location.origin)}>
        Reload
      </Button>
    </Container>
  );
}
