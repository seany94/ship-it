require "application_system_test_case"

class JobsTest < ApplicationSystemTestCase
  setup do
    @job = jobs(:one)
  end

  test "visiting the index" do
    visit jobs_url
    assert_selector "h1", text: "Jobs"
  end

  test "creating a Job" do
    visit jobs_url
    click_on "New Job"

    fill_in "Accepted", with: @job.accepted
    fill_in "Completed", with: @job.completed
    fill_in "Date delivery", with: @job.date_delivery
    fill_in "Date pickup", with: @job.date_pickup
    fill_in "End-location", with: @job.end-location
    fill_in "Start location", with: @job.start_location
    fill_in "User", with: @job.user_id
    click_on "Create Job"

    assert_text "Job was successfully created"
    click_on "Back"
  end

  test "updating a Job" do
    visit jobs_url
    click_on "Edit", match: :first

    fill_in "Accepted", with: @job.accepted
    fill_in "Completed", with: @job.completed
    fill_in "Date delivery", with: @job.date_delivery
    fill_in "Date pickup", with: @job.date_pickup
    fill_in "End-location", with: @job.end-location
    fill_in "Start location", with: @job.start_location
    fill_in "User", with: @job.user_id
    click_on "Update Job"

    assert_text "Job was successfully updated"
    click_on "Back"
  end

  test "destroying a Job" do
    visit jobs_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Job was successfully destroyed"
  end
end
