const api = require('./api');

/* blacklist of repositories to not include */
const blacklist = ['rfcs'];

const getForOrg = async org => {
  let pageNum = 1;
  let results = [];
  let isEmpty = false;
  while (!isEmpty) {
    const {data} = await api.repos.getForOrg({
      org: org,
      page: pageNum,
    });
    results.push(data);

    pageNum++;
    isEmpty = data.length === 0;
  }

  const data = [].concat.apply([], results);
  console.log(data.map(d => d.name));
  return data.filter(item => !blacklist.includes(item.name)).map(item => {
    return {
      upstream: org,
      name: item.name,
    };
  });
};

module.exports = async function getRepos() {
  return [
    ...(await getForOrg('fusionjs')),
    ...(await getForOrg('uber-workflow')),
  ];
};
