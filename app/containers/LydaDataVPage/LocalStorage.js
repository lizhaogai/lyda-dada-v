import uid from 'node-uuid';

export default {



  Connection: {
    save: function (data) {
      if (!data.id) {
        data.id = uid.v1();
      }
      let localData = localStorage['connections'];
      if (localData) {
        localData = JSON.parse(localData);
      } else {
        localData = [];
      }
      let found = false;
      localData.map((_data, index) => {
        if (_data.id == data.id) {
          found = true;
          localData[index] = data;
        }
      });

      if (!found) {
        localData.push(data);
      }
      localStorage['connections'] = JSON.stringify(localData);
      return new Promise((resolve, reject) => {
        resolve();
      });

    },
    get: function () {
      return new Promise((resolve, reject) => {
        let localData = localStorage['connections'];
        if (localData) {
          localData = JSON.parse(localData);
        } else {
          localData = [];
        }
        resolve(localData || [])
      });

    }
  },
  Collection: {
    get: function (id) {
      let collections = [].concat(_collections);
      collections.map((collection) => {
        collection.connectionId = id;
      });

      return new Promise((resolve) => {
        resolve(collections);
      });
    }
  }
}

let _collections = [
  {
    "title": "User",
    "name": "user",
  },
  {
    "title": "Admin",
    "name": "admin",
  },
  {
    "title": "销售业绩",
    "name": "SalesPerformance",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "销售部月度计划",
    "name": "SalesMonthlyPlan",
    "owner": "58072e8b120ea87c192fe243"
  },
  {
    "title": "销售部团队月度计划",
    "name": "SalesTeamMonthlyPlan",
    "owner": "58072e8b120ea87c192fe243"
  },
  {
    "title": "部门跑马灯",
    "name": "SalesMarquee",
    "owner": "58072e8b120ea87c192fe243"
  },
  {
    "title": "Customer",
    "name": "customer",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "续费",
    "name": "Renewals",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "邀约与拜访",
    "name": "InvitationAndVisit",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "推广账号",
    "name": "PromotionAccount",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "运营部消耗值",
    "name": "OperationConsumption",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "推广账号待处理",
    "name": "PromotionAccountToDos",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "运营数据汇报",
    "name": "OperationData",
    "owner": "58039167dbbb235b08d654ee"
  },
  {
    "title": "推广账号选择",
    "name": "PromotionAccountSelector",
    "owner": "58039167dbbb235b08d654ee"
  }
];