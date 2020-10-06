const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

/*
* Test POST in /scrapingNews
*/
describe('POST: /scrapingNews', () => {
    it('it should return crawled news', (done) => {
        let bodyReq = {
            filter: "0"
        }
        chai.request(server)
            .post('/scrapingNews')
            .send(bodyReq)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});