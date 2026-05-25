import React, { useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function BlogSubpage() {
  const { siteData } = useContext(AppContext);
  const { blogSlug } = useParams();
  const blogs = siteData.blogs || [];

  // Find the matching blog post
  const blog = blogs.find(b => b.slug === blogSlug);

  // If not found, redirect to Blog listing page
  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="page-container fade-in" style={{ padding: '0 5% 5rem 5%' }}>
      <style>{`
        .blog-detail-wrapper {
          max-width: 900px;
          margin: 0 auto;
        }
        .back-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--secondary, #3b82f6);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          margin-bottom: 2rem;
          transition: transform 0.3s;
        }
        .back-nav:hover {
          transform: translateX(-4px);
        }
        .blog-detail-banner {
          width: 100%;
          height: 400px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          margin-bottom: 3rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
        }
        .blog-detail-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blog-detail-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 35, 69, 0.85) 0%, rgba(0, 35, 69, 0.3) 50%, rgba(0, 0, 0, 0) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        .blog-detail-category {
          align-self: flex-start;
          background: var(--secondary, #3b82f6);
          color: #ffffff;
          padding: 5px 14px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .blog-detail-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .blog-detail-meta {
          display: flex;
          gap: 1.5rem;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .blog-content-card {
          padding: 3rem;
          border-radius: 24px;
          margin-bottom: 3rem;
        }
        .blog-paragraph {
          font-size: 1.15rem;
          color: var(--text-light, #334155);
          line-height: 1.8;
          margin-bottom: 1.8rem;
          text-align: justify;
        }
        .blog-paragraph:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          .blog-detail-banner {
            height: 300px;
          }
          .blog-detail-banner-overlay {
            padding: 1.5rem;
          }
          .blog-detail-title {
            font-size: 1.8rem;
          }
          .blog-content-card {
            padding: 1.5rem;
          }
          .blog-paragraph {
            font-size: 1.05rem;
            line-height: 1.7;
          }
        }
      `}</style>

      <div className="blog-detail-wrapper">
        {/* Back Link */}
        <Link to="/blog" className="back-nav">
          &larr; Back to Articles
        </Link>

        {/* Banner with info */}
        <div className="blog-detail-banner">
          <img 
            className="blog-detail-banner-img"
            src={blog.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80'} 
            alt={blog.title} 
          />
          <div className="blog-detail-banner-overlay">
            {blog.category && <span className="blog-detail-category">{blog.category}</span>}
            <h1 className="blog-detail-title">{blog.title}</h1>
            <div className="blog-detail-meta">
              <span>✍️ By {blog.author || 'Admin'}</span>
              <span>📅 Published: {blog.date}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="blog-content-card glass">
          {blog.content && blog.content.map((para, idx) => (
            <p key={idx} className="blog-paragraph">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogSubpage;
