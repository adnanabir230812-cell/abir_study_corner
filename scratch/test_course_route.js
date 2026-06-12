const { getCourse } = require('../controllers/courseController');
const path = require('path');

// Mock request and response objects
const req = {
  params: { id: '1' },
  headers: { cookie: '' }
};

const res = {
  render: (view, data) => {
    console.log('Success rendering view:', view);
    console.log('Sections length:', data.course.Sections.length);
  },
  status: function(code) {
    console.log('Status set to:', code);
    return this;
  },
  send: (msg) => {
    console.log('Sent response:', msg);
  }
};

(async () => {
  try {
    console.log('Invoking getCourse...');
    await getCourse(req, res);
  } catch (err) {
    console.error('Caught error during getCourse execution:', err);
  }
})();
