const { Investment, Sponsorship, Property } = require("../database/Models");
const Investor = require("../database/Models/Investor");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 }
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }

    const investor = await Investor.paginate(query, options);
    if (investor.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: investor });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: investor,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var investment = await Investment.findById({ _id });
    if (investment)
      return res.send({ status: 200, message: "Data found", data: investment });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;

    var query = { email: payload.investor.email };
    /** Using Upsert */
    const investor = await Investor.findOneAndUpdate(
      query,
      {
        name: payload.investor.name,
        profile: payload.investor.profile,
        email: payload.investor.email,
        phone: payload.investor.phone,
        address: payload.investor.address,
        state: payload.investor.state,
        city: payload.investor.city,
        zipcode: payload.investor.zipcode,
      },
      { upsert: true }
    );

    return res.send({
      status: 200,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    const _id = payload._id;
    var query = { email: payload.investor.email };

    var investment = await Investment.findById({ _id });
    if (!investment)
      return res.send({ status: 404, message: "No data found", data: {} });

    /** Using Upsert */
    const investor = await Investor.findOneAndUpdate(
      query,
      {
        name: payload.investor.name,
        profile: payload.investor.profile,
        email: payload.investor.email,
        phone: payload.investor.phone,
        address: payload.investor.address,
        state: payload.investor.state,
        city: payload.investor.city,
        zipcode: payload.investor.zipcode,
      },
      { upsert: true }
    );

    const inv = investment.update({
      property_name: payload.property_name ?? null,
      inv_entity: payload.inv_entity ?? null,
      portal_url: payload.portal_url ?? null,
      portal_user_id: payload.portal_user_id ?? null,
      portal_password: payload.portal_password ?? null,
      note: payload.note ?? null,
      investment_amount: payload.investment_amount ?? null,
      year_1_returns: payload.year_1_returns ?? null,
      year_2_returns: payload.year_2_returns ?? null,
      year_3_returns: payload.year_3_returns ?? null,
      year_4_returns: payload.year_4_returns ?? null,
      year_5_returns: payload.year_5_returns ?? null,
      irr: payload.irr ?? null,
      investor: investor._id,
    });

    const property = await Property.findOneAndUpdate(
      { _id: payload.property._id },
      {
        property_name: payload.property.property_name,
        entity_name: payload.property.entity_name,
        address: payload.property.address,
        property_type: payload.property.property_type,
        units: payload.property.units,
        year_built: payload.property.year_built,
        state: payload.property.state,
        city: payload.property.city,
        close_date: payload.property.close_date,
        expected_hold_period: payload.property.expected_hold_period,
        zipcode: payload.property.zipcode,
        distribution_frequency: payload.property.distribution_frequency,
        distribution_month: payload.property.distribution_month,
        investment_id: investment._id,
      }
    );

    const sponsorship = await Sponsorship.findOneAndUpdate(
      { _id: payload.sponsorship._id },
      {
        group_name: payload.sponsorship.group_name,
        members: payload.sponsorship.members,
        investment_id: investment._id,
      }
    );

    await investment.properties.push(property);
    await investment.sponsorships.push(sponsorship);
    await investment.save();

    return res.send({
      status: 200,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};
