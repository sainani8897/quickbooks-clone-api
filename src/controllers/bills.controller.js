const Bill = require("../database/Models/Bill");
const PurchaseOrder = require("../database/Models/PurchaseOrder");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {

    try {
        /** Pagination obj  */
        const options = {
            page: req.query.page ?? 1,
            limit: req.query.limit ?? 10,
            sort: { createdAt: -1 },
            populate: ['vendor_id', 'purchase_order']
        };

        const query = req.query;
        if (
            typeof req.query._id !== "undefined" &&
            !req.query._id.match(/^[0-9a-fA-F]{24}$/)
        ) {
            return res.send({ status: 404, message: "Not found!" });
        }
        const products = await Bill.paginate(query, options);
        if (products.totalDocs > 0)
            return res.send({ status: 200, message: "Data found", data: products });
        else
            return res.send({
                status: 204,
                message: "No Content found",
                data: products,
            });
    }
    catch (error) {
        next(error);
    }
};


exports.show = async function (req, res, next) {
    const _id = req.params.id;
    try {
        var product = await Bill.findById({ _id });
        if (product)
            return res.send({ status: 200, message: "Data found", data: product });
        else throw new NotFoundException("No Data Found!");
    } catch (error) {
        next(error);
    }
};


exports.create = async function (req, res, next) {
    try {
        /** Basic Form */
        const payload = req.body.payload;
        console.log(req.body.payload);

        const purchaseOrder = await PurchaseOrder.findById(payload.purchase_order);

        if (!purchaseOrder)
            throw new NotFoundException("Purchase Order Not found!");



        const product = await Bill.create({
            bill_no: payload.bill_no,
            bill_date: payload.bill_date,
            due_date: payload.due_date,
            vendor_id: purchaseOrder.vendor_id,
            items: payload.items,
            sale_details: payload.sale_details,
            purchase_order: payload.purchase_order,
            status: payload.status,
            created_by: req.user._id,
            org_id: req.user.org_id,
            reference: purchaseOrder.reference,
            shipping_notes: payload.shipping_notes,
            customer_notes: payload.notes,
        });

        if (Array.isArray(payload.files)) {
            /** Files */
            payload.files.forEach((file) => {
                product.files.push(file);
            });

            (await product).save();
        }

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
        if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.send({ status: 404, message: "Not found!" });
        }

        var order = await Bill.findById({ _id });
        if (!order)
            return res.send({ status: 404, message: "No data found", data: {} });
        const purchaseOrder = await PurchaseOrder.findById(payload.purchase_order);

        if (!purchaseOrder)
            throw new NotFoundException("Purchase Order Not found!");

        const result = await order.update({
            bill_no: payload.bill_no,
            bill_date: payload.bill_date,
            due_date: payload.due_date,
            vendor_id: purchaseOrder.vendor_id,
            items: payload.items,
            sale_details: payload.sale_details,
            purchase_order: payload.purchase_order,
            status: payload.status,
            created_by: req.user._id,
            org_id: req.user.org_id,
            reference: purchaseOrder.reference,
            shipping_notes: payload.shipping_notes,
            customer_notes: payload.notes,
        });

        /** Delete  */
        if (Array.isArray(payload.files)) {
            /** Files */
            payload.files.forEach((file) => {
                document.files.push(file);
            });

            (await document).save();
        }

        return res.send({
            status: 200,
            message: "Updated Successfully",
        });
    } catch (error) {
        next(error);
    }
};


exports.delete = async function (req, res, next) {
    try {
        const ids = req.body._id;

        ids.forEach((id) => {
            if (typeof id !== "undefined" && !id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.send({ status: 404, message: "Not found!" });
            }
        });

        /** Delete */
        const product = await Bill.find(
            {
                _id: ids,
            },
            null
        );
        // console.log(vendor);
        if (product.length <= 0) {
            return res.send({
                status: 204,
                message: "No Data found!",
            });
        }

        product.forEach((doc) => {
            /** Delete File */
            doc.delete();
        });

        return res.send({
            status: 200,
            message: "Deleted Successfully",
        });
    } catch (error) {
        next(error);
    }
};