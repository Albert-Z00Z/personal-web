import "./ArticleResources.scss"
import React, { useState } from "react"
import Article from "/src/components/articles/base/Article.jsx"
import DateBadge from "/src/components/widgets/DateBadge.jsx"
import Link from "/src/components/generic/Link.jsx"
import { useViewport } from "/src/providers/ViewportProvider.jsx"

function ArticleResources({ dataWrapper }) {
  const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

  return (
    <Article
      id={dataWrapper.uniqueId}
      type={Article.Types.SPACING_DEFAULT}
      dataWrapper={dataWrapper}
      className="article-resources"
      selectedItemCategoryId={selectedItemCategoryId}
      setSelectedItemCategoryId={setSelectedItemCategoryId}
    >
      <ArticleResourcesItems
        dataWrapper={dataWrapper}
        selectedItemCategoryId={selectedItemCategoryId}
      />
    </Article>
  )
}

function ArticleResourcesItems({ dataWrapper, selectedItemCategoryId }) {
  const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)
  return (
    <div className="article-resources-items-grid">
      {filteredItems.map((itemWrapper, key) => (
        <ArticleResourceItem itemWrapper={itemWrapper} key={key} />
      ))}
    </div>
  )
}

/** Título: acepta string o { text, href } */
function TitleWithLink({ itemWrapper }) {
  const title = itemWrapper.locales.title
  const resolved =
    typeof title === "object" && title !== null
      ? { text: title.text, href: title.href }
      : { text: title, href: null }

  return (
    <span
      className="article-resources-item-title-text"
      dangerouslySetInnerHTML={{ __html: resolved.text || itemWrapper.placeholder || "" }}
    />
  )
}

function ArticleResourceItem({ itemWrapper }) {
  const viewport = useViewport()
  const largeTexts = viewport.isMobileLayout()
  const titleClass = largeTexts ? "eq-h5" : "lead"
  const textClass = largeTexts ? "text-3" : "text-2"
  const dateBadgeClass = "text-2"

  // Modo opcional: "card" para hacer toda la tarjeta clicable; por defecto "button"
  const cardLinkMode = itemWrapper.link?.mode === "card"
  const href = itemWrapper.link?.href

  // dentro de ArticleResourceItem
const startDate =
  itemWrapper.dateStart || itemWrapper.date || null; // soporta {year, month}
const endDate =
  itemWrapper.dateEnd || null;

// ...
{startDate && (
  <DateBadge
    dateStart={startDate}
    {...(endDate ? { dateEnd: endDate } : {})}  // solo pasa dateEnd si existe
    variant={DateBadge.Variants.TRANSPARENT}
    className={`article-resources-item-date ${dateBadgeClass}`}
  />
)}


  const CardInner = (
    <>
      {/* Banner superior (si no hay, se muestra skeleton) */}
      <div className="article-resources-item-banner">
        {itemWrapper.banner || itemWrapper.img ? (
          <img
            src={itemWrapper.banner || itemWrapper.img}
            alt={itemWrapper.imageAlt || "resource banner"}
            className="article-resources-item-banner-img"
            loading="lazy"
          />
        ) : (
          <div className="article-resources-item-banner-skeleton" />
        )}
      </div>

      <div className="article-resources-item-content">
        <h6 className={`article-resources-item-title ${titleClass}`}>
          <TitleWithLink itemWrapper={itemWrapper} />
        </h6>

        <div
          className={`article-resources-item-desc ${textClass} mt-1`}
          dangerouslySetInnerHTML={{ __html: itemWrapper.locales.text || "" }}
        />

        {(itemWrapper.dateStart || itemWrapper.date) && (
          <DateBadge
            dateStart={itemWrapper.dateStartDisplay || itemWrapper.date}
            dateEnd={itemWrapper.dateEndDisplay}
            variant={DateBadge.Variants.TRANSPARENT}
            className={`article-resources-item-date ${dateBadgeClass}`}
          />
        )}

        {/* Botón al recurso (solo si no es card-link) */}
        {!cardLinkMode && href && (
          <div className="article-resources-item-footer">
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-btn"
            >
              Ir al recurso
            </Link>
          </div>
        )}
      </div>
    </>
  )

  return cardLinkMode && href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="article-resources-item article-resources-item--as-link"
    >
      {CardInner}
    </Link>
  ) : (
    <div className="article-resources-item">
      {CardInner}
    </div>
  )
}

export default ArticleResources
