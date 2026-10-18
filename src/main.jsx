import { createRoot } from 'react-dom/client';
import { MotionStudio } from './components/MotionStudio.jsx';

// This file is only the browser entry point; import MotionStudio elsewhere to
// embed the editor without executing this mounting code.
createRoot(document.getElementById('root')).render(<MotionStudio />);
