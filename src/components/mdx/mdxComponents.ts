import TableOfContents from '@/components/Blog/TableOfContents';
import { serverComponents } from './server-components';
import ImageZoom from './ImageZoom';

export const mdxComponents = {
  ...serverComponents,
  img: ImageZoom,
  TableOfContents,
};
