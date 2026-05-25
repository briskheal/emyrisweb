import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Blog() {
  const { siteData } = useContext(AppContext);
  const blogs = siteData.blogs || [];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check if a blog is active based on status and scheduled release time
  const isBlogActive = (blog) => {
    if (!blog.status || blog.status === 'published') return true;
    if (blog.status === 'scheduled' && blog.publishDate) {
      return new Date(blog.publishDate) <= new Date();
    }
    return false;
  };

  const activeBlogs = blogs.filter(isBlogActive);

  // Extract unique categories from active blogs
  const categories = ['All', ...new Set(activeBlogs.map(b => b.category).filter(Boolean))];

  // Filter blogs based on selected category
  const filteredBlogs = selectedCategory === 'All' 
    ? activeBlogs 
    : activeBlogs.filter(b => b.category === selectedCategory);

  // Helper to get text excerpt
  const getExcerpt = (contentArray, maxLength = 130) => {
    if (!contentArray || contentArray.length === 0) return '';
    const firstParagraph = contentArray[0];
    if (firstParagraph.length <= maxLength) return firstParagraph;
    return firstParagraph.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="page-container fade-in">
      <style>{`
        .blog-header {
          text-align: center;
          margin-bottom: 3.5rem;
          position: relative;
        }
        .blog-header h3 {
          color: var(--secondary, #3b82f6);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .blog-header h1 {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--primary, #002345);
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .blog-header p {
          max-width: 700px;
          margin: 0 auto;
          color: var(--text-muted, #64748b);
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .category-filter-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }
        .filter-btn {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid var(--glass-border, rgba(226, 232, 240, 0.8));
          color: var(--text-light, #334155);
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }
        .filter-btn:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: var(--secondary, #3b82f6);
          color: var(--secondary, #3b82f6);
          transform: translateY(-1px);
        }
        .filter-btn.active {
          background: var(--primary, #002345);
          border-color: var(--primary, #002345);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 35, 69, 0.15);
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2.5rem;
          margin-bottom: 4rem;
        }
        .blog-card {
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px rgba(0, 35, 69, 0.08);
          border-color: rgba(59, 130, 246, 0.2);
        }
        .blog-card-img-wrapper {
          position: relative;
          height: 220px;
          width: 100%;
          overflow: hidden;
          background: #f1f5f9;
        }
        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .blog-card:hover .blog-card-img {
          transform: scale(1.06);
        }
        .blog-card-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.95);
          color: var(--primary, #002345);
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(4px);
        }
        .blog-card-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .blog-card-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-muted, #64748b);
          margin-bottom: 0.8rem;
          align-items: center;
        }
        .blog-card-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .blog-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary, #002345);
          line-height: 1.3;
          margin-bottom: 0.8rem;
          transition: color 0.3s;
        }
        .blog-card:hover .blog-card-title {
          color: var(--secondary, #3b82f6);
        }
        .blog-card-excerpt {
          color: var(--text-muted, #64748b);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex-grow: 1;
          text-align: justify;
        }
        .blog-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--secondary, #3b82f6);
          font-weight: 700;
          font-size: 0.9rem;
          transition: gap 0.3s;
          text-decoration: none;
          margin-top: auto;
        }
        .blog-card:hover .blog-card-link {
          gap: 10px;
        }
        .no-blogs {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted, #64748b);
        }
      `}</style>

      {/* Header */}
      <div className="blog-header">
        <h3>Public Health Awareness</h3>
        <h1>Articles & Medical Insights</h1>
        <p>
          Stay informed with our latest news, clinical discoveries, and public health awareness initiatives. Educating societies for healthier living.
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="category-filter-bar">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="no-blogs glass">
          <h2>No articles found</h2>
          <p>Check back later for new updates and releases.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="blog-card glass">
              <div className="blog-card-img-wrapper">
                <img 
                  className="blog-card-img" 
                  src={blog.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'} 
                  alt={blog.title} 
                />
                {blog.category && <span className="blog-card-category">{blog.category}</span>}
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>✍️ {blog.author || 'Admin'}</span>
                  <span>📅 {blog.date}</span>
                </div>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{getExcerpt(blog.content)}</p>
                <Link to={`/blog/${blog.slug}`} className="blog-card-link">
                  Read Full Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;
