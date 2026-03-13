export type {
  Book,
  ReadingLog,
  Movie,
  Course,
  Note,
  Idea,
  ReadingStats,
} from './types';

export {
  // Books
  createBook,
  updateBook,
  deleteBook,
  getBook,
  getBooks,
  updateReadingProgress,

  // Reading Logs
  createReadingLog,
  updateReadingLog,
  deleteReadingLog,
  getReadingLogs,
  logReadingSession,

  // Movies
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getMovies,
  markMovieWatched,

  // Courses
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourseProgress,

  // Notes
  createNote,
  updateNote,
  deleteNote,
  getNote,
  getNotes,

  // Ideas
  createIdea,
  updateIdea,
  deleteIdea,
  getIdea,
  getIdeas,

  // Statistics
  getReadingStats,
} from './services';

export {
  useBooks,
  useBook,
  useReadingLogs,
  useMovies,
  useCourses,
  useNotes,
  useIdeas,
  useReadingStats,
} from './hooks';
