const config = require("../config")["api"];

let utils = require("../helpers/utils");

var exports = (module.exports = {});

exports.apiLog = async function (req, res) {
  const { Log } = require("../models");
  const { logMessage, logLevel } = req.body;
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  try {
    const log = await Log.create({
      logMessage,
      logLevel,
    });

    return res.status(200).send({
      message: "Log saved!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.createFinancialTable = async function (req, res) {
  const { FinancialTable } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { userId, tableName } = req.body;

  try {
    const financialTable = await FinancialTable.create({ userId, tableName });

    return res.status(200).send({
      message: "Financial table successfully created!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.getFinancialTablesByUser = async function (req, res) {
  const { FinancialTable } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { userId } = req.body;

  try {
    const financialTables = await FinancialTable.findAll({
      where: { userId },
    });
    return res.status(200).send({
      data: financialTables,
      message: "Financial data retrieved successfully!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.getFinancialTableDataByUuid = async function (req, res) {
  const { FinancialTable, Incomes, Outgoings } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { tableUuid } = req.body;

  try {
    const financialTable = await FinancialTable.findAll({
      where: { uuid: tableUuid },
      include: [
        { model: Incomes, as: "incomes" },
        { model: Outgoings, as: "outgoings" },
      ],
    });

    return res.status(200).send({
      data: financialTable,
      message: "Financial table data retrieved successfully!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.deleteFinancialTableByUuid = async function (req, res) {
  const { FinancialTable, Incomes, Outgoings } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { tableUuid } = req.body;

  try {
    const financialTable = await FinancialTable.findOne({
      where: { uuid: tableUuid },
      include: [Incomes, Outgoings],
    });

    if (financialTable) {
      await Promise.all([
        Incomes.destroy({ where: { financialTableId: financialTable.uuid } }),
        Outgoings.destroy({ where: { financialTableId: financialTable.uuid } }),
      ]);

      await financialTable.destroy();

      return res.status(200).send({
        message: "Financial table successfully deleted!",
      });
    }

    return res.status(404).send({ message: "No table find in the database!" });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.createIncomeItem = async function (req, res) {
  const { Incomes } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const {
    incomeDate,
    incomeTitle,
    incomeAmount,
    incomeCategory,
    incomeOrigin,
    description,
    tableUuid,
  } = req.body;

  try {
    const incomeItem = await Incomes.create({
      incomeDate,
      incomeTitle,
      incomeAmount,
      incomeCategory,
      incomeOrigin,
      description,
      financialTableId: tableUuid,
    });

    return res.status(200).send({
      message: "Income item successfully created!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.createOutgoingItem = async function (req, res) {
  const { Outgoings } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const {
    outgoingDate,
    outgoingTitle,
    outgoingAmount,
    outgoingCategory,
    outgoingOrigin,
    outgoingLocation,
    outgoingOnSale,
    description,
    tableUuid,
  } = req.body;

  try {
    const outgoingItem = await Outgoings.create({
      outgoingDate,
      outgoingTitle,
      outgoingAmount,
      outgoingCategory,
      outgoingOrigin,
      outgoingLocation,
      outgoingOnSale,
      description,
      financialTableId: tableUuid,
    });

    return res.status(200).send({
      message: "Outgoing item successfully created!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.deleteIncomeItem = async function (req, res) {
  const { Incomes } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { incomeId } = req.body;

  try {
    const incomeItem = await Incomes.findOne({
      where: { incomeId },
    });

    if (incomeItem) {
      await incomeItem.destroy();

      return res.status(200).send({
        message: "Income item successfully deleted!",
      });
    }

    return res.status(404).send({ message: "No table find in the database!" });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.deleteOutgoingItem = async function (req, res) {
  const { Outgoings } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { outgoingId } = req.body;

  try {
    const outgoingItem = await Outgoings.findOne({
      where: { outgoingId },
    });

    if (outgoingItem) {
      await outgoingItem.destroy();

      return res.status(200).send({
        message: "Outgoing item successfully deleted!",
      });
    }

    return res.status(404).send({ message: "No table find in the database!" });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.editFinancialTableTitle = async function (req, res) {
  const { FinancialTable } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const { uuid, tableName } = req.body;

  try {
    const financialTable = await FinancialTable.update(
      { tableName },
      {
        where: { uuid },
      }
    );

    return res.status(200).send({
      message: "Financial table title successfully edited!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.editOutgoingCard = async function (req, res) {
  const { Outgoings } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const {
    outgoingId,
    outgoingTitle,
    outgoingAmount,
    outgoingCategory,
    outgoingOrigin,
    outgoingLocation,
    outgoingOnSale,
    description,
  } = req.body;

  try {
    const outgoingCard = await Outgoings.update(
      {
        outgoingTitle,
        outgoingAmount,
        outgoingCategory,
        outgoingOrigin,
        outgoingLocation,
        outgoingOnSale,
        description,
      },
      {
        where: { outgoingId },
      }
    );

    return res.status(200).send({
      message: "Outgoing card successfully edited!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.editIncomeCard = async function (req, res) {
  const { Incomes } = require("../models");
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const authenticateToken = req.headers["authenticate"];

  if (!authenticateToken || config.apiToken !== authenticateToken.slice(7)) {
    utils.writeToLogFile(`IP: ${ip} -- (API token not valid!)`, "warning");
    return res.status(403).send({ message: "API token not valid!" });
  }

  const {
    incomeId,
    incomeTitle,
    incomeAmount,
    incomeCategory,
    incomeOrigin,
    description,
  } = req.body;

  try {
    const incomeCard = await Incomes.update(
      {
        incomeTitle,
        incomeAmount,
        incomeCategory,
        incomeOrigin,
        description,
      },
      {
        where: { incomeId },
      }
    );

    return res.status(200).send({
      message: "Income card successfully edited!",
    });
  } catch (error) {
    utils.writeToLogFile(`IP: ${ip} -- ${error}`, "error");
    return res.status(500).send({ message: "Something went wrong!" });
  }
};
