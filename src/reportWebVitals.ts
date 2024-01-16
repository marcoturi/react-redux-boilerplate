import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    import('web-vitals')
      // eslint-disable-next-line promise/always-return
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error on webVitals', error);
      });
  }
};

export default reportWebVitals;
