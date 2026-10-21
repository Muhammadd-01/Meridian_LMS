import { DEMO_VIDEO_URL } from '../data/images'
import { uid } from './ids'

export function blankLesson(type = 'video') {
  return {
    id: uid('les'), title: '', type, description: '', durationMinutes: type === 'video' ? 10 : 15, content: '',
    videoUrl: type === 'video' ? DEMO_VIDEO_URL : '', isPreview: false, required: type !== 'resource', quizId: null, assignmentId: null,
  }
}

export function blankModule(n = 1) {
  return { id: uid('mod'), title: `Module ${n}`, description: '', lessons: [blankLesson('video')] }
}
