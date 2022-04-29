module.exports = async function languageCheck(lang) {
  switch (lang) {
    case 'pl-pl':
      return 'Polish';
    case 'pl':
      return 'Polish';
    case 'en-gb':
      return 'English';
    case 'en':
      return 'English';
    case 'en-us':
      return 'English';

    default:
      return '';
  }
};
