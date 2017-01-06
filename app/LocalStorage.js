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
    get: function (appId) {
      return new Promise((resolve, reject) => {
        let localData = localStorage['connections'];
        if (localData) {
          localData = JSON.parse(localData);
        } else {
          localData = [];
        }

        let results = localData.map((connection) => {
          if (connection.appId == appId) {
            return connection;
          }
        });
        resolve(results || [])
      });

    }
  },
  Collection: {
    get: function (connectId) {
      let collections = [].concat(_collections);
      collections.map((collection) => {
        collection.connectionId = connectId;
      });

      return new Promise((resolve) => {
        resolve(collections);
      });
    }
  },
  Resource: {
    get: function (connectId, resourceName) {
      let resource = null;
      resources.map((item) => {
        if (item.name == resourceName) {
          resource = item;
        }
      });

      return new Promise((resolve) => {
        resolve(resource);
      });
    }
  },
  Layer: {
    save: function (data) {
      if (!data.id) {
        data.id = uid.v1();
      }
      let localData = localStorage['layers'];
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
      localStorage['layers'] = JSON.stringify(localData);
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    get: function (appId) {
      return new Promise((resolve, reject) => {
        let localData = localStorage['layers'];
        if (localData) {
          localData = JSON.parse(localData);
        } else {
          localData = [];
        }

        let results = localData.map((layer) => {
          if (layer.appId == appId) {
            return layer;
          }
        });
        resolve(results || [])
      });
    },
    findById: function (layerId) {
      return new Promise((resolve, reject) => {
        let localData = localStorage['layers'];
        if (localData) {
          localData = JSON.parse(localData);
        } else {
          localData = [];
        }

        let layer = localData.find(_layer => {
          return _layer.id == layerId;
        });
        resolve(layer)
      });
    }
  },
  Report: {
    query: function (query) {
      let datas = [];

      while (true) {
        let data = {};
        query.layer.fields.map((field) => {
          if (field.type.toLowerCase() == 'number') {
            data[field.name] = parseInt(Math.random() * 100);
          } else if (field.type.toLowerCase() == 'string') {
            data[field.name] = uid.v1().substr(4, 10);
          } else if (field.type.toLowerCase() == 'date') {
            data[field.name] = new Date().toJSON();
          }
        });
        datas.push(data);
        if (datas.length >= 10) {
          break;
        }
      }
      return new Promise((resolve, reject) => {
        resolve(datas);
      });
    }
  }
}

let resources = [
  {
    "id": "58039303992ed55d24675d90",
    "name": "SalesPerformance",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "date",
        "type": "Date",
        "label": "日期（Date）"
      },
      {
        "name": "invitations",
        "type": "Number",
        "label": "邀约数（Invitations）"
      },
      {
        "name": "visits",
        "type": "Number",
        "label": "拜访数（Visits）"
      },
      {
        "name": "contracts",
        "type": "Number",
        "label": "签单数（Contracts）"
      },
      {
        "name": "feeservice",
        "type": "Number",
        "label": "服务费总金额（FeeService）"
      },
      {
        "name": "feerecharge",
        "type": "Number",
        "label": "充值费总金额（FeeRecharge)"
      },
      {
        "name": "renewalrecharge",
        "type": "Number",
        "label": "续费（RenewalRecharge）"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "580e09885e48cd14b5d86c93",
    "name": "SalesMonthlyPlan",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "部门"
      },
      {
        "name": "monthly",
        "type": "Date",
        "label": "月度"
      },
      {
        "name": "contracts",
        "type": "Number",
        "label": "签单量"
      },
      {
        "name": "amount",
        "type": "Number",
        "label": "签单额"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "582914d7b442da043b0819f1",
    "name": "SalesTeamMonthlyPlan",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "monthly",
        "type": "Date",
        "label": "月度"
      },
      {
        "name": "contracts",
        "type": "Number",
        "label": "签单量"
      },
      {
        "name": "amount",
        "type": "Number",
        "label": "签单金额"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "582915d0b442da043b0819f3",
    "name": "SalesMarquee",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "date",
        "type": "String",
        "label": "date"
      },
      {
        "name": "content",
        "type": "String",
        "label": "通知内容"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "58468389be58b80ed0e37ac4",
    "name": "customer",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "name",
        "type": "String",
        "label": "客户名称"
      },
      {
        "name": "customerPhone",
        "type": "String",
        "label": "客户手机"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "584685babe58b80ed0e37ac6",
    "name": "Renewals",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "date",
        "type": "Date",
        "label": "续费日期"
      },
      {
        "name": "renewals",
        "type": "Number",
        "label": "续费金额"
      },
      {
        "name": "rebate",
        "type": "Number",
        "label": "续费返点"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "584686aabe58b80ed0e37ac8",
    "name": "InvitationAndVisit",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "date",
        "type": "Date",
        "label": "汇报日期"
      },
      {
        "name": "invitations",
        "type": "Number",
        "label": "邀约数（Invitations）"
      },
      {
        "name": "visits",
        "type": "Number",
        "label": "拜访数（Visits）"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "584fee1764a30a186299db40",
    "name": "PromotionAccount",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "accountId",
        "type": "String",
        "label": "账号ID"
      },
      {
        "name": "nickname",
        "type": "String",
        "label": "昵称"
      },
      {
        "name": "accountName",
        "type": "String",
        "label": "账号登陆名"
      },
      {
        "name": "password",
        "type": "String",
        "label": "密码"
      },
      {
        "name": "accountType",
        "type": "String",
        "label": "账号类型"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "584fef8e64a30a186299db42",
    "name": "OperationConsumption",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "accountNickname",
        "type": "String",
        "label": "accountNickname"
      },
      {
        "name": "accountId",
        "type": "String",
        "label": "accountId"
      },
      {
        "name": "accountPassword",
        "type": "String",
        "label": "accountPassword"
      },
      {
        "name": "accountUsername",
        "type": "String",
        "label": "accountUsername"
      },
      {
        "name": "date",
        "type": "Date",
        "label": "日期"
      },
      {
        "name": "consumption",
        "type": "Number",
        "label": "消耗值"
      },
      {
        "name": "plan",
        "type": "Number",
        "label": "计划消耗值"
      },
      {
        "name": "materialCount",
        "type": "Number",
        "label": "上线素材数"
      },
      {
        "name": "materialPlan",
        "type": "Number",
        "label": "计划上线素材"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  }, {
    "id": "584ff0bc64a30a186299db44",
    "name": "PromotionAccountToDos",
    "columns": [
      {
        "name": "org",
        "type": "String",
        "label": "org"
      },
      {
        "name": "team",
        "type": "String",
        "label": "team"
      },
      {
        "name": "account",
        "type": "String",
        "label": "account"
      },
      {
        "name": "commitTime",
        "type": "Date",
        "label": "提交时间"
      },
      {
        "name": "content",
        "type": "String",
        "label": "内容"
      },
      {
        "name": "finished",
        "type": "Boolean",
        "label": "是否完成并且关闭"
      }
    ],
    "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
  },
];

let _collections = [
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
  }
];