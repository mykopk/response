import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_WRAPPER = 'SKIP_RESPONSE_WRAPPER';

export const SkipResponseWrapper = () => SetMetadata(SKIP_RESPONSE_WRAPPER, true);
