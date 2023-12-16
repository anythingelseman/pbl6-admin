describe('Test update new cinema', () => {
    before(() => {
        //cy.loginAdmin();
    });

    beforeEach(() => {
        cy.loginAdmin();
    });

    it('UC1 - Chỉnh sửa thông tin cinema: Tên bị để trống', () => {
        cy.visit('http://localhost:3000/manage/cinema');
        cy.wait(4000);

        cy.contains('Edit').eq(0).click(); // open model thêm chuyên khoa
        cy.wait(100);
        var numberRandom = Math.random().toString().slice(2, 6);
        cy.get('input[name=city]').type('Da Nang');
        cy.get('input[name=name]').clear();
        cy.get('input[name=description]').type('Da Nang Cinephile Cinema - Best Cinema Center Region');
        cy.wait(100);
        cy.contains('Update').click();

        cy.wait(500);
        cy.contains('Please fill in all the fields').should('exist');
    });

    it('UC2 - Chỉnh sửa thông tin cinema: Mô tả bị để trống', () => {
        cy.visit('http://localhost:3000/manage/cinema');
        cy.wait(4000);

        cy.contains('Edit').eq(0).click(); // open model thêm chuyên khoa
        cy.wait(100);
        var numberRandom = Math.random().toString().slice(2, 6);
        cy.get('input[name=name]').type('Da Nang Cinephile Hung Vuong');
        cy.get('input[name=city]').type('Da Nang');
        cy.get('input[name=description]').clear();
        cy.wait(100);
        cy.contains('Update').click();

        cy.wait(500);
        cy.contains('Please fill in all the fields').should('exist');
    });

    it('UC3 - Chỉnh sửa thông tin cinema: Thành phố bị để trống', () => {
        cy.visit('http://localhost:3000/manage/cinema');
        cy.wait(4000);

        cy.contains('Edit').eq(0).click(); // open model thêm chuyên khoa
        cy.wait(100);
        var numberRandom = Math.random().toString().slice(2, 6);
        cy.get('input[name=name]').type('Da Nang Cinephile Hung Vuong');
        cy.get('input[name=city]').clear();
        cy.get('input[name=description]').type('Da Nang Cinephile Cinema - Best Cinema Center Region');
        cy.wait(100);
        cy.contains('Update').click();

        cy.wait(500);
        cy.contains('Please fill in all the fields').should('exist');
    });

    it('UC4 - Chỉnh sửa thông tin cinema: Cập nhật thành công', () => {
        cy.visit('http://localhost:3000/manage/cinema');
        cy.wait(4000);

        cy.contains('Edit').eq(0).click(); 
        cy.wait(100);
        var numberRandom = Math.random().toString().slice(2, 6);
        cy.get('input[name=name]').clear();
        cy.get('input[name=city]').clear();
        cy.get('input[name=description]').clear();
        cy.get('input[name=name]').type('Da Nang Cinephile Hung Vuong');
        cy.get('input[name=city]').type('Da Nang');
        cy.get('input[name=description]').type('Da Nang Cinephile Cinema - Best Cinema Center Region');
        cy.wait(100);
        cy.contains('Update').click();

        cy.wait(500);
        cy.contains('Edit cinema successfully').should('exist');
    });


});