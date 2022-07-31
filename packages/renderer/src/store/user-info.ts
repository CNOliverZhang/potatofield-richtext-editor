import Store from 'electron-store';

const userInfo = (store: Store) => {
  const setTermsAgreed = (termsAgreed: boolean) => {
    store.set('termsAgreed', termsAgreed);
  };

  const getTermsAgreed = () => {
    return store.get('termsAgreed') as boolean;
  };

  const setIdentifier = (identifier: string) => {
    store.set('identifier', identifier);
  };

  const getIdentifier = () => {
    return store.get('identifier') as string;
  };

  return {
    setTermsAgreed,
    getTermsAgreed,
    setIdentifier,
    getIdentifier
  };
};

export default userInfo;
