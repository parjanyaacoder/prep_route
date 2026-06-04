import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, BookOpen, AlertCircle, X, Filter, Plus, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTests } from '../store/slices/testSlice';
import type { AppDispatch, RootState } from '../store/store';
import type { Test } from '../types';

function TestCard({ test }: { test: Test }) {
  const getStatusColor = (status: string | null) => {
    if (status === 'live') return 'bg-green-100 text-green-700';
    if (status === 'draft') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{test.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{test.subject}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to={`/tests/create?id=${test.id}`}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Test"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(test.status)}`}>
            {test.status || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="w-4 h-4 mr-3 text-blue-500" />
          <span>{test.total_questions || 0} Questions</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-3 text-blue-500" />
          <span>{test.total_time || 0} Minutes</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-3 text-blue-500" />
          <span>Created on {formatDate(test.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function EllipsisPagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === currentPage
            ? 'bg-blue-600 text-white'
            : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { tests, loading, error } = useSelector((state: RootState) => state.test);

  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  const uniqueSubjects = Array.from(new Set(tests.map(t => t.subject).filter(Boolean)));

  const filteredTests = tests.filter(test => {
    if (subjectFilter && test.subject !== subjectFilter) return false;
    if (statusFilter && test.status !== statusFilter) return false;
    if (dateFilter) {
      const testDate = new Date(test.created_at).toISOString().split('T')[0];
      if (testDate !== dateFilter) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTests.length / limit);
  const currentTests = filteredTests.slice((currentPage - 1) * limit, currentPage * limit);

  useEffect(() => {
    setCurrentPage(1);
  }, [subjectFilter, statusFilter, dateFilter]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and view all your test modules</p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/tests/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Test
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
          </select>

          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {(subjectFilter || statusFilter || dateFilter) && (
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-sm text-gray-500">Active Filters:</span>
          {subjectFilter && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
              {subjectFilter}
              <button onClick={() => setSubjectFilter('')} className="ml-2 hover:text-blue-900 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {statusFilter && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('')} className="ml-2 hover:text-blue-900 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {dateFilter && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
              Date: {dateFilter}
              <button onClick={() => setDateFilter('')} className="ml-2 hover:text-blue-900 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => { setSubjectFilter(''); setStatusFilter(''); setDateFilter(''); }}
            className="text-sm text-gray-500 hover:text-gray-800 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 h-48 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-1/2">
                  <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-3" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredTests.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Tests Found</h3>
          <p className="text-gray-500">
            {tests.length === 0 ? "You haven't created any tests yet." : "No tests match your selected filters."}
          </p>
        </div>
      )}

      {!loading && currentTests.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>

          <EllipsisPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
