import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CoursesHero from '../sections/academy/CoursesHero';
import LearningPath from '../sections/academy/LearningPath';
import FlagshipProgram from '../sections/academy/FlagshipProgram';
import CourseGrid from '../sections/academy/CourseGrid';
import CourseModal, { type CourseData } from '../components/admin/CourseModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';

export default function Courses() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete course');
    }
  };

  const flagshipCourse = courses.find(c => c.isFlagship);
  const regularCourses = courses.filter(c => !c.isFlagship);

  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#0a0a0a' }}>
      <CoursesHero />
      
      {isAdmin && (
        <div className="flex justify-center -mt-10 mb-10 relative z-20">
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-full transition-colors font-semibold"
          >
            <Plus size={20} />
            Create New Course
          </button>
        </div>
      )}

      <LearningPath />

      {flagshipCourse && (
        <FlagshipProgram
          course={flagshipCourse}
          isAdmin={isAdmin}
          onEdit={(c) => {
            setEditingCourse(c);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <CourseGrid
        courses={regularCourses}
        isAdmin={isAdmin}
        onEdit={(c) => {
          setEditingCourse(c);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        course={editingCourse}
        onSaved={fetchCourses}
      />
    </div>
  );
}
