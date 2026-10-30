import { Link } from 'react-router';
import { Button } from '@/UI/Base/button';
import { Container } from '@/UI/Elements/Container';
import { Text } from '@/UI/Elements/Text';

function NotFoundPage() {
  return (
    <Container
      className="flex flex-col items-start gap-4"
      data-testid="not-found-page"
    >
      <title>Page not found | React Boilerplate</title>
      <Text size="7" as="h1">
        Page not found
      </Text>
      <Text as="p">The page you are looking for does not exist.</Text>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </Container>
  );
}

export default NotFoundPage;
