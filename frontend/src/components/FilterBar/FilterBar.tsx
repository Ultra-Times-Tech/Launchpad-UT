import {useState, useEffect, useRef} from 'react'
import {useTranslation} from '../../hooks/useTranslation'

export type FilterCategory = 'art' | 'game-assets' | 'collectibles'
export type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low' | 'popularity'
export type PriceRange = '0-100' | '100-500' | '500-1000' | '1000+'

interface FilterBarProps {
  selectedCategories: Set<FilterCategory>
  selectedPriceRanges: Set<PriceRange>
  sortBy: SortOption
  searchQuery: string
  onCategoryToggle: (category: FilterCategory) => void
  onPriceRangeToggle: (range: PriceRange) => void
  onSortChange: (sort: SortOption) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
}

const FilterBar: React.FC<FilterBarProps> = ({selectedCategories, selectedPriceRanges, sortBy, searchQuery, onCategoryToggle, onPriceRangeToggle, onSortChange, onSearchChange, onClearFilters}) => {
  const {t} = useTranslation()
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'categories' | 'price' | null>(null)

  const categoriesDropdownRef = useRef<HTMLDivElement>(null)
  const categoriesButtonRef = useRef<HTMLButtonElement>(null)
  const priceDropdownRef = useRef<HTMLDivElement>(null)
  const priceButtonRef = useRef<HTMLButtonElement>(null)

  const categories: {value: FilterCategory; label: string}[] = [
    {value: 'art', label: 'Art'},
    {value: 'game-assets', label: 'Game Assets'},
    {value: 'collectibles', label: 'Collectibles'},
  ]

  const priceRanges: {value: PriceRange; label: string}[] = [
    {value: '0-100', label: t('price_range_0_100')},
    {value: '100-500', label: t('price_range_100_500')},
    {value: '500-1000', label: t('price_range_500_1000')},
    {value: '1000+', label: t('price_range_1000_plus')},
  ]

  const sortOptions: {value: SortOption; label: string}[] = [
    {value: 'newest', label: t('newest')},
    {value: 'oldest', label: t('oldest')},
    {value: 'price-high', label: t('price_high')},
    {value: 'price-low', label: t('price_low')},
    {value: 'popularity', label: t('popularity')},
  ]

  const handleDropdownClick = (dropdown: 'categories' | 'price') => {
    setOpenDropdown(prevOpen => (prevOpen === dropdown ? null : dropdown))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown === 'categories') {
        if (categoriesButtonRef.current && !categoriesButtonRef.current.contains(event.target as Node) && categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      } else if (openDropdown === 'price') {
        if (priceButtonRef.current && !priceButtonRef.current.contains(event.target as Node) && priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  return (
    <div className='w-full'>
      {/* Mobile Filter Button */}
      <div className='lg:hidden mb-4'>
        <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className='w-full px-4 py-3 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500 transition-colors flex items-center justify-between' aria-expanded={isFilterMenuOpen} aria-controls='filter-menu'>
          <span className='text-white'>Filters & Sort</span>
          <svg className={`w-5 h-5 transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div id='filter-menu' className={`lg:block ${isFilterMenuOpen ? 'block' : 'hidden'}`}>
        <div className='bg-dark-800 rounded-xl p-4 lg:p-6 space-y-4'>
          <div className='flex flex-col lg:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative group'>
                <input type='text' placeholder={t('search_placeholder')} value={searchQuery} onChange={e => onSearchChange(e.target.value)} className='w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 pl-10 transition-colors group-hover:border-primary-500/50' aria-label='Search collections' />
                <svg className='absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-hover:text-primary-500/70 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Categories Dropdown */}
              <div className='relative'>
                <button
                  ref={categoriesButtonRef}
                  onClick={() => handleDropdownClick('categories')}
                  className='w-full lg:w-auto px-4 py-3 bg-dark-900 rounded-xl border border-dark-700 hover:border-primary-500 transition-all flex items-center justify-between gap-2 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  aria-expanded={openDropdown === 'categories'}
                  aria-haspopup='true'>
                  <span className='whitespace-nowrap'>{t('filter_by_category')}</span>
                  <svg className={`w-4 h-4 transition-transform ${openDropdown === 'categories' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>
                {openDropdown === 'categories' && (
                  <div ref={categoriesDropdownRef} className='absolute z-50 mt-2 w-64 bg-dark-900 rounded-xl shadow-xl border border-dark-700 p-4 backdrop-blur-xl'>
                    <div className='space-y-2'>
                      {categories.map(category => (
                        <label key={category.value} className='flex items-center space-x-3 cursor-pointer group hover:bg-dark-800 p-2 rounded-lg transition-colors'>
                          <div className='relative flex items-center'>
                            <input
                              type='checkbox'
                              checked={selectedCategories.has(category.value)}
                              onChange={() => onCategoryToggle(category.value)}
                              className='w-5 h-5 border-2 border-primary-500/50 rounded bg-dark-800 checked:bg-primary-500 checked:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 transition-colors cursor-pointer'
                              aria-label={`Filter by ${category.label}`}
                            />
                          </div>
                          <span className='text-sm group-hover:text-primary-300 transition-colors'>{t(category.value)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Ranges Dropdown */}
              <div className='relative'>
                <button ref={priceButtonRef} onClick={() => handleDropdownClick('price')} className='w-full lg:w-auto px-4 py-3 bg-dark-900 rounded-xl border border-dark-700 hover:border-primary-500 transition-all flex items-center justify-between gap-2 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20' aria-expanded={openDropdown === 'price'} aria-haspopup='true'>
                  <span className='whitespace-nowrap'>{t('filter_by_price')}</span>
                  <svg className={`w-4 h-4 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>
                {openDropdown === 'price' && (
                  <div ref={priceDropdownRef} className='absolute z-50 mt-2 w-64 bg-dark-900 rounded-xl shadow-xl border border-dark-700 p-4 backdrop-blur-xl'>
                    <div className='space-y-2'>
                      {priceRanges.map(range => (
                        <label key={range.value} className='flex items-center space-x-3 cursor-pointer group hover:bg-dark-800 p-2 rounded-lg transition-colors'>
                          <div className='relative flex items-center'>
                            <input
                              type='checkbox'
                              checked={selectedPriceRanges.has(range.value)}
                              onChange={() => onPriceRangeToggle(range.value)}
                              className='w-5 h-5 border-2 border-primary-500/50 rounded bg-dark-800 checked:bg-primary-500 checked:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 transition-colors cursor-pointer'
                              aria-label={`Filter by price range ${range.label}`}
                            />
                          </div>
                          <span className='text-sm group-hover:text-primary-300 transition-colors'>{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <select value={sortBy} onChange={e => onSortChange(e.target.value as SortOption)} className='w-full lg:w-auto px-4 py-3 bg-dark-900 rounded-xl border border-dark-700 hover:border-primary-500 transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-white' aria-label='Sort collections'>
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className='bg-dark-900 text-white'>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button onClick={onClearFilters} className='w-full lg:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 focus:ring-offset-dark-800' aria-label='Clear all filters'>
                {t('clear_filters')}
              </button>
            </div>
          </div>

          {/* Selected Filters */}
          {(selectedCategories.size > 0 || selectedPriceRanges.size > 0) && (
            <div className='flex flex-wrap gap-2 pt-4 border-t border-dark-700'>
              {Array.from(selectedCategories).map(category => (
                <span key={category} className='px-3 py-1.5 bg-primary-500/20 text-white rounded-lg text-sm flex items-center gap-2 group hover:bg-primary-500/30 transition-colors'>
                  {t(category)}
                  <button onClick={() => onCategoryToggle(category)} className='hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded' aria-label={`Remove ${t(category)} filter`}>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </span>
              ))}
              {Array.from(selectedPriceRanges).map(range => (
                <span key={range} className='px-3 py-1.5 bg-primary-500/20 text-white rounded-lg text-sm flex items-center gap-2 group hover:bg-primary-500/30 transition-colors'>
                  {range.replace('-', ' to ').replace('under-', 'Under ').replace('above-', 'Above ')} UOS
                  <button onClick={() => onPriceRangeToggle(range)} className='hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded' aria-label={`Remove ${range} price filter`}>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterBar