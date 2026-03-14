'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Book, Film, GraduationCap, FileText, Lightbulb, Trash2, Pencil, Star } from 'lucide-react';
import { Badge } from '@/ui/components/badge';
import { ProgressBar } from '@/ui/components/progress-bar';

interface BookItem {
  id: string;
  title: string;
  author?: string;
  pages?: number;
  currentPage: number;
  status: 'want_to_read' | 'reading' | 'completed';
  rating?: number;
}

interface Movie {
  id: string;
  title: string;
  year?: number;
  genre?: string;
  rating?: number;
  watched: boolean;
}

interface Course {
  id: string;
  title: string;
  provider?: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

interface Idea {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'captured' | 'reviewing' | 'active' | 'archived';
}

const mockBooks: BookItem[] = [
  { id: '1', title: 'Атомные привычки', author: 'Джеймс Клир', pages: 320, currentPage: 150, status: 'reading' },
  { id: '2', title: 'Думай медленно', author: 'Даниэль Канеман', pages: 640, currentPage: 640, status: 'completed', rating: 5 },
];

const mockMovies: Movie[] = [
  { id: '1', title: 'Начало', year: 2010, genre: 'Фантастика', rating: 5, watched: true },
  { id: '2', title: 'Интерстеллар', year: 2014, genre: 'Фантастика', watched: false },
];

const mockCourses: Course[] = [
  { id: '1', title: 'Machine Learning', provider: 'Coursera', progress: 65, status: 'active' },
  { id: '2', title: 'React Advanced', provider: 'Udemy', progress: 100, status: 'completed' },
];

const mockNotes: Note[] = [
  { id: '1', title: 'Идеи для проекта', content: 'Сделать CRUD страницы...', createdAt: Date.now() },
];

const mockIdeas: Idea[] = [
  { id: '1', title: 'Новая фича', description: 'Добавить аналитику', category: 'продукт', status: 'reviewing' },
];

export default function MindPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'books' | 'movies' | 'courses' | 'notes' | 'ideas'>('books');
  const [books, setBooks] = useState<BookItem[]>(mockBooks);
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const booksRead = books.filter(b => b.status === 'completed').length;
  const booksReading = books.filter(b => b.status === 'reading').length;
  const avgRating = books.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) / booksRead || 0;

  const handleAddBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBook: BookItem = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      pages: Number(formData.get('pages')),
      currentPage: 0,
      status: 'want_to_read' as const,
    };
    setBooks([...books, newBook]);
    setIsDialogOpen(false);
  };

  const updateBookProgress = (id: string, newPage: number) => {
    setBooks(books.map(b => {
      if (b.id === id) {
        const updated = { ...b, currentPage: newPage };
        if (newPage >= (b.pages || 0)) {
          updated.status = 'completed';
        } else if (newPage > 0) {
          updated.status = 'reading';
        }
        return updated;
      }
      return b;
    }));
  };

  const handleDelete = (id: string, type: 'book' | 'movie' | 'course' | 'note' | 'idea') => {
    switch (type) {
      case 'book': setBooks(books.filter(b => b.id !== id)); break;
      case 'movie': setMovies(movies.filter(m => m.id !== id)); break;
      case 'course': setCourses(courses.filter(c => c.id !== id)); break;
      case 'note': setNotes(notes.filter(n => n.id !== id)); break;
      case 'idea': setIdeas(ideas.filter(i => i.id !== id)); break;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'outline'> = {
      completed: 'success',
      reading: 'default',
      want_to_read: 'outline',
      active: 'default',
      paused: 'warning',
      watching: 'default',
      watched: 'success',
      reviewing: 'warning',
    };
    return <Badge variant={variants[status] || 'outline'}>{t(`mind.${status}`) || status}</Badge>;
  };

  const tabs = [
    { id: 'books' as const, label: t('mind.books'), icon: Book },
    { id: 'movies' as const, label: t('mind.movies'), icon: Film },
    { id: 'courses' as const, label: t('mind.courses'), icon: GraduationCap },
    { id: 'notes' as const, label: t('mind.notes'), icon: FileText },
    { id: 'ideas' as const, label: t('mind.ideas'), icon: Lightbulb },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.mind')}</h1>
            <p className="text-muted-foreground">{t('mind.books')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(false)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeTab === 'books' && t('mind.addBook')}
                  {activeTab === 'movies' && t('mind.addMovie')}
                  {activeTab === 'courses' && t('mind.addCourse')}
                  {activeTab === 'notes' && t('mind.notes')}
                  {activeTab === 'ideas' && t('mind.ideas')}
                </DialogTitle>
              </DialogHeader>
              {activeTab === 'books' && (
                <form onSubmit={handleAddBook} className="space-y-4">
                  <Input name="title" label={t('mind.title')} required />
                  <Input name="author" label={t('mind.author')} />
                  <Input name="pages" type="number" label={t('mind.pages')} />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('common.create')}</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Summary Cards for Books */}
        {activeTab === 'books' && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('mind.completed')}</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{booksRead}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('mind.reading')}</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{booksReading}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('mind.rating')}</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Books List */}
            <div className="grid gap-4 md:grid-cols-2">
              {books.map((book) => {
                const progress = book.pages ? (book.currentPage / book.pages) * 100 : 0;
                return (
                  <Card key={book.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{book.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {book.author} • {book.pages} {t('mind.pages')}
                          </CardDescription>
                        </div>
                        {getStatusBadge(book.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{book.currentPage} / {book.pages}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar value={progress} showLabel={false} />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Стр."
                          className="h-8 w-24"
                          onChange={(e) => updateBookProgress(book.id, Number(e.target.value))}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id, 'book')}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {book.rating && (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < book.rating! ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Movies List */}
        {activeTab === 'movies' && (
          <div className="grid gap-4 md:grid-cols-2">
            {movies.map((movie) => (
              <Card key={movie.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{movie.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {movie.year} • {movie.genre}
                      </CardDescription>
                    </div>
                    {getStatusBadge(movie.watched ? 'watched' : 'watching')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {movie.rating && (
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < movie.rating! ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(movie.id, 'movie')}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Courses List */}
        {activeTab === 'courses' && (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="text-xs">{course.provider}</CardDescription>
                    </div>
                    {getStatusBadge(course.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ProgressBar value={course.progress} showLabel />
                  <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => handleDelete(course.id, 'course')}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notes List */}
        {activeTab === 'notes' && (
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id, 'note')}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Ideas List */}
        {activeTab === 'ideas' && (
          <div className="grid gap-4 md:grid-cols-2">
            {ideas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{idea.title}</CardTitle>
                      <CardDescription className="text-xs">{idea.category}</CardDescription>
                    </div>
                    {getStatusBadge(idea.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{idea.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
