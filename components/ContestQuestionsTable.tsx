'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContestQuestion } from '@/actions/get-contest-questions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, X } from 'lucide-react';

interface ContestQuestionsTableProps {
    questions: ContestQuestion[];
}

type SortField = 'id' | 'title' | 'contestName' | 'problemIndex' | 'rating';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 12;
const PROBLEM_INDICES = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function ContestQuestionsTable({ questions }: ContestQuestionsTableProps) {
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('rating');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    // Filters
    const [selectedProblemIndices, setSelectedProblemIndices] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<string>('');
    const [maxRating, setMaxRating] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1);
    };

    const toggleProblemIndex = (index: string) => {
        setSelectedProblemIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
        setCurrentPage(1);
    };

    const filteredAndSortedQuestions = useMemo(() => {
        let filtered = questions;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (q) =>
                    q.title.toLowerCase().includes(query) ||
                    q.contestName.toLowerCase().includes(query) ||
                    q.id.toString().includes(query) ||
                    q.problemIndex.toLowerCase().includes(query) ||
                    q.rating.toString().includes(query)
            );
        }

        // Filter by problem indices (multi-select)
        if (selectedProblemIndices.length > 0) {
            filtered = filtered.filter((q) => selectedProblemIndices.includes(q.problemIndex));
        }

        // Filter by rating range
        if (minRating) {
            const min = parseFloat(minRating);
            if (!isNaN(min)) {
                filtered = filtered.filter((q) => q.rating >= min);
            }
        }
        if (maxRating) {
            const max = parseFloat(maxRating);
            if (!isNaN(max)) {
                filtered = filtered.filter((q) => q.rating <= max);
            }
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            let aVal: string | number = a[sortField];
            let bVal: string | number = b[sortField];

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [questions, searchQuery, sortField, sortDirection, selectedProblemIndices, minRating, maxRating]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedQuestions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedQuestions = filteredAndSortedQuestions.slice(startIndex, endIndex);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '⇅';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 2500) return 'text-red-500 font-semibold';
        if (rating >= 2000) return 'text-orange-500 font-semibold';
        if (rating >= 1500) return 'text-yellow-500 font-medium';
        return 'text-green-500';
    };

    const clearFilters = () => {
        setSelectedProblemIndices([]);
        setMinRating('');
        setMaxRating('');
        setSearchInput('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedProblemIndices.length > 0 || minRating || maxRating || searchQuery;

    return (
        <div className="space-y-4">
            {/* Compact Single-Row Filter Layout */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search Bar - Reduced Width */}
                <div className="relative flex-1 min-w-[200px] max-w-[400px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search questions..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border h-9"
                    />
                </div>

                {/* Problem Index Multi-Select Dropdown */}
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 min-w-[140px] justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span>
                                    {selectedProblemIndices.length === 0
                                        ? 'Problem #'
                                        : selectedProblemIndices.length === 1
                                            ? selectedProblemIndices[0]
                                            : `${selectedProblemIndices.length} selected`}
                                </span>
                            </div>
                            {selectedProblemIndices.length > 0 && (
                                <X
                                    className="h-3 w-3 ml-2 opacity-50 hover:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProblemIndices([]);
                                        setCurrentPage(1);
                                    }}
                                />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2" align="start">
                        <div className="space-y-1">
                            {PROBLEM_INDICES.map((index) => (
                                <label
                                    key={index}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedProblemIndices.includes(index)}
                                        onChange={() => toggleProblemIndex(index)}
                                        className="h-4 w-4 rounded border-border"
                                    />
                                    <span className="text-sm">{index}</span>
                                </label>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Rating Range - Compact */}
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={minRating}
                        min="0"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || parseFloat(value) >= 0) {
                                setMinRating(value);
                                setCurrentPage(1);
                            }
                        }}
                        className="bg-secondary/50 border-border h-9 w-[90px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-muted-foreground text-sm">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={maxRating}
                        min="0"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || parseFloat(value) >= 0) {
                                setMaxRating(value);
                                setCurrentPage(1);
                            }
                        }}
                        className="bg-secondary/50 border-border h-9 w-[90px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9 text-muted-foreground hover:text-foreground"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedQuestions.length)} of{' '}
                    {filteredAndSortedQuestions.length} questions
                    {hasActiveFilters && ` (filtered from ${questions.length} total)`}
                </span>
                {searchInput !== searchQuery && (
                    <span className="text-xs italic">Searching...</span>
                )}
            </div>

            {/* Table with Shutter Animation */}
            <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-secondary/70 transition-colors"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex items-center gap-2">
                                        ID
                                        <span className="text-xs opacity-60">{getSortIcon('id')}</span>
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-secondary/70 transition-colors"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center gap-2">
                                        Title
                                        <span className="text-xs opacity-60">{getSortIcon('title')}</span>
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-secondary/70 transition-colors"
                                    onClick={() => handleSort('contestName')}
                                >
                                    <div className="flex items-center gap-2">
                                        Contest
                                        <span className="text-xs opacity-60">{getSortIcon('contestName')}</span>
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-secondary/70 transition-colors"
                                    onClick={() => handleSort('problemIndex')}
                                >
                                    <div className="flex items-center gap-2">
                                        #
                                        <span className="text-xs opacity-60">{getSortIcon('problemIndex')}</span>
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-secondary/70 transition-colors"
                                    onClick={() => handleSort('rating')}
                                >
                                    <div className="flex items-center gap-2">
                                        Rating
                                        <span className="text-xs opacity-60">{getSortIcon('rating')}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <AnimatePresence mode="wait">
                            <motion.tbody
                                key={currentPage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="divide-y divide-border"
                            >
                                {paginatedQuestions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No questions found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedQuestions.map((question, index) => (
                                        <motion.tr
                                            key={question.id}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                ease: "easeOut"
                                            }}
                                            className="hover:bg-secondary/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-sm font-mono">{question.id}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <a
                                                    href={`https://leetcode.com/problems/${question.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary hover:underline transition-colors"
                                                >
                                                    {question.title}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {question.contestName}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                                                {question.problemIndex}
                                            </td>
                                            <td className={`px-4 py-3 text-sm font-mono ${getRatingColor(question.rating)}`}>
                                                {Math.round(question.rating)}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </motion.tbody>
                        </AnimatePresence>
                    </table>
                </div>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                        {/* First Page */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        {/* Previous */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                            <Button
                                key={index}
                                variant={page === currentPage ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                disabled={typeof page === 'string'}
                                className="h-8 min-w-8 px-2"
                            >
                                {page}
                            </Button>
                        ))}

                        {/* Next */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Last Page */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
