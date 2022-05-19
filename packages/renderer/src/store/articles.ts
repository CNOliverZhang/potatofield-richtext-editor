import Store from 'electron-store';

const articles = (store: Store) => {
  const setArticleList = (articleList: Article[]) => {
    store.set('articleList', articleList);
  };

  const getArticleList = () => {
    return (store.get('articleList') as Article[]) || [];
  };

  const addArticle = (article: Article) => {
    store.set('articleList', [...((store.get('articleList') as Article[]) || []), article]);
  };

  const removeArticle = (articleId: string) => {
    const articleList = (store.get('articleList') as Article[]) || [];
    const index = articleList.findIndex((article) => article.id === articleId);
    if (index >= 0) {
      articleList.splice(index, 1);
      store.set('articleList', articleList);
    }
  };

  const updateArticle = (articleId: string, updatedArticle: Article) => {
    const articleList = (store.get('articleList') as Article[]) || [];
    const index = articleList.findIndex((article) => article.id === articleId);
    if (index >= 0) {
      articleList.splice(index, 1, updatedArticle);
      store.set('articleList', articleList);
    }
  };

  const watchArticleList = (
    callback: (articleList: Article[], oldArticleList: Article[]) => void,
  ) => {
    store.onDidChange('articleList', (newValue, oldValue) => {
      callback(newValue as Article[], oldValue as Article[]);
    });
  };

  return {
    setArticleList,
    getArticleList,
    addArticle,
    removeArticle,
    updateArticle,
    watchArticleList,
  };
};

export default articles;
